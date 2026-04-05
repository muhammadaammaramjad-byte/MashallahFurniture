// Cloud Storage Service for Image Uploads
// Supports multiple providers: Cloudinary, Uploadcare, AWS S3, etc.

class CloudStorageService {
    constructor(provider = 'cloudinary') {
        this.provider = provider;
        this.config = this.getProviderConfig(provider);
        this.uploadQueue = [];
        this.isUploading = false;
    }

    // Get configuration for different providers
    getProviderConfig(provider) {
        const configs = {
            cloudinary: {
                cloudName: 'mashallah-furniture', // Replace with your cloud name
                uploadPreset: 'mashallah_uploads', // Replace with your upload preset
                apiKey: 'your_api_key', // Replace with your API key
                apiSecret: 'your_api_secret', // Replace with your API secret
                baseUrl: 'https://api.cloudinary.com/v1_1'
            },
            uploadcare: {
                publicKey: 'your_public_key', // Replace with Uploadcare public key
                baseUrl: 'https://upload.uploadcare.com'
            },
            // Add more providers as needed
        };

        return configs[provider] || configs.cloudinary;
    }

    // Upload single image to cloud storage
    async uploadImage(file, options = {}) {
        try {
            // Validate file
            this.validateFile(file);

            // Compress image if needed
            const compressedFile = await this.compressImage(file, options.quality || 0.8);

            // Upload based on provider
            switch (this.provider) {
                case 'cloudinary':
                    return await this.uploadToCloudinary(compressedFile, options);
                case 'uploadcare':
                    return await this.uploadToUploadcare(compressedFile, options);
                default:
                    throw new Error(`Unsupported provider: ${this.provider}`);
            }
        } catch (error) {
            console.error('Cloud upload failed:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    // Upload to Cloudinary
    async uploadToCloudinary(file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.config.uploadPreset);

        // Add optional transformations
        if (options.width) formData.append('width', options.width);
        if (options.height) formData.append('height', options.height);
        if (options.crop) formData.append('crop', options.crop);
        if (options.quality) formData.append('quality', options.quality);

        // Add metadata
        formData.append('folder', options.folder || 'mashallah/products');
        formData.append('public_id', options.publicId || `product_${Date.now()}`);

        const response = await fetch(
            `${this.config.baseUrl}/${this.config.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Cloudinary upload failed');
        }

        const data = await response.json();

        return {
            url: data.secure_url,
            thumbnail: data.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill/'),
            publicId: data.public_id,
            format: data.format,
            width: data.width,
            height: data.height,
            bytes: data.bytes,
            provider: 'cloudinary'
        };
    }

    // Upload to Uploadcare (alternative provider)
    async uploadToUploadcare(file, options = {}) {
        const formData = new FormData();
        formData.append('UPLOADCARE_PUB_KEY', this.config.publicKey);
        formData.append('UPLOADCARE_STORE', '1'); // Store permanently
        formData.append('file', file);

        const response = await fetch(this.config.baseUrl + '/base/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Uploadcare upload failed');
        }

        const data = await response.json();

        return {
            url: data.file,
            thumbnail: data.file + '-/resize/300x300/',
            publicId: data.file_id,
            provider: 'uploadcare'
        };
    }

    // Upload multiple images with queue management
    async uploadImages(files, options = {}) {
        const results = [];
        const errors = [];

        // Add to queue
        this.uploadQueue.push(...files.map(file => ({ file, options })));

        // Process queue
        while (this.uploadQueue.length > 0 && !this.isUploading) {
            this.isUploading = true;

            try {
                const { file, options: fileOptions } = this.uploadQueue.shift();
                const result = await this.uploadImage(file, fileOptions);
                results.push(result);

                // Call progress callback
                if (options.onProgress) {
                    options.onProgress(results.length, files.length);
                }
            } catch (error) {
                errors.push(error);
                console.error('Batch upload error:', error);
            } finally {
                this.isUploading = false;
            }
        }

        return { results, errors };
    }

    // Delete image from cloud storage
    async deleteImage(publicId, provider = this.provider) {
        try {
            switch (provider) {
                case 'cloudinary':
                    return await this.deleteFromCloudinary(publicId);
                case 'uploadcare':
                    return await this.deleteFromUploadcare(publicId);
                default:
                    throw new Error(`Delete not supported for provider: ${provider}`);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            throw error;
        }
    }

    // Delete from Cloudinary
    async deleteFromCloudinary(publicId) {
        const formData = new FormData();
        formData.append('public_ids[]', publicId);
        formData.append('api_key', this.config.apiKey);

        // Generate signature (simplified - use server-side for production)
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = this.generateSignature(publicId, timestamp);

        const response = await fetch(
            `${this.config.baseUrl}/${this.config.cloudName}/image/destroy`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Basic ${btoa(this.config.apiKey + ':' + this.config.apiSecret)}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Cloudinary delete failed');
        }

        return await response.json();
    }

    // Delete from Uploadcare
    async deleteFromUploadcare(fileId) {
        const response = await fetch(`${this.config.baseUrl}/files/${fileId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Uploadcare.Simple ${this.config.publicKey}:`
            }
        });

        if (!response.ok) {
            throw new Error('Uploadcare delete failed');
        }

        return { success: true };
    }

    // Generate Cloudinary signature (simplified)
    generateSignature(publicId, timestamp) {
        // In production, generate this server-side for security
        // This is a placeholder - implement proper signature generation
        return 'placeholder_signature';
    }

    // Compress image before upload
    async compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions (max 1920px width/height)
                const maxSize = 1920;
                let { width, height } = img;

                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Validate file before upload
    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Unsupported file type: ${file.type}. Allowed: JPG, PNG, WebP, GIF`);
        }

        if (file.size > maxSize) {
            throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB`);
        }
    }

    // Get image info/metadata
    async getImageInfo(publicId, provider = this.provider) {
        try {
            switch (provider) {
                case 'cloudinary':
                    return await this.getCloudinaryInfo(publicId);
                default:
                    throw new Error(`Info not supported for provider: ${provider}`);
            }
        } catch (error) {
            console.error('Get info failed:', error);
            throw error;
        }
    }

    // Get Cloudinary image info
    async getCloudinaryInfo(publicId) {
        const response = await fetch(
            `${this.config.baseUrl}/${this.config.cloudName}/image/info/${publicId}`
        );

        if (!response.ok) {
            throw new Error('Failed to get image info');
        }

        return await response.json();
    }

    // Generate different image sizes
    generateImageUrls(baseUrl, sizes = [300, 600, 1200]) {
        if (this.provider === 'cloudinary') {
            return sizes.reduce((acc, size) => {
                acc[size] = baseUrl.replace('/upload/', `/upload/w_${size},c_fill/`);
                return acc;
            }, {});
        }

        // For other providers, return base URL
        return { original: baseUrl };
    }

    // Batch operations
    async batchDelete(imageIds, provider = this.provider) {
        const results = await Promise.allSettled(
            imageIds.map(id => this.deleteImage(id, provider))
        );

        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        return { successful, failed, results };
    }

    // Get upload stats
    getStats() {
        return {
            provider: this.provider,
            queueLength: this.uploadQueue.length,
            isUploading: this.isUploading,
            config: { ...this.config, apiSecret: '[HIDDEN]' } // Hide sensitive data
        };
    }
}

// Export singleton instance
export default new CloudStorageService();