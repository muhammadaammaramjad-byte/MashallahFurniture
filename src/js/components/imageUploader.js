// Image Uploader Component for Product Images
// Supports drag & drop, preview, compression, and upload to cloud storage

class ImageUploader {
    constructor(options = {}) {
        this.options = {
            maxFiles: options.maxFiles || 5,
            maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB
            acceptedTypes: options.acceptedTypes || ['image/jpeg', 'image/png', 'image/webp'],
            container: options.container || '#imageUploader',
            onUpload: options.onUpload || (() => {}),
            onError: options.onError || (() => {}),
            ...options
        };

        this.files = [];
        this.uploadedUrls = [];
        this.init();
    }

    init() {
        this.createUploader();
        this.bindEvents();
    }

    createUploader() {
        const container = document.querySelector(this.options.container);
        if (!container) return;

        container.innerHTML = `
            <div class="image-uploader">
                <div class="upload-zone" id="uploadZone">
                    <div class="upload-zone-content">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="upload-text">
                            <p class="primary-text">Drop images here or click to browse</p>
                            <p class="secondary-text">Supports JPG, PNG, WebP (max ${this.options.maxFiles} files, ${Math.round(this.options.maxSize / 1024 / 1024)}MB each)</p>
                        </div>
                        <button type="button" class="upload-btn" id="uploadBtn">
                            <i class="fas fa-folder-open"></i>
                            Choose Files
                        </button>
                    </div>
                </div>
                <input type="file" id="fileInput" multiple accept="${this.options.acceptedTypes.join(',')}" style="display: none;">
                <div class="preview-container" id="previewContainer"></div>
                <div class="upload-progress" id="uploadProgress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-text" id="progressText">Uploading...</div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('image-uploader-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'image-uploader-styles';
        styles.textContent = `
            .image-uploader {
                width: 100%;
                max-width: 600px;
            }

            .upload-zone {
                border: 2px dashed #ddd;
                border-radius: 8px;
                padding: 40px 20px;
                text-align: center;
                background: #fafafa;
                transition: all 0.3s ease;
                cursor: pointer;
                margin-bottom: 20px;
            }

            .upload-zone:hover,
            .upload-zone.dragover {
                border-color: #8B4513;
                background: #f9f5f0;
            }

            .upload-zone-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .upload-icon {
                font-size: 48px;
                color: #8B4513;
            }

            .upload-text .primary-text {
                font-size: 18px;
                font-weight: 500;
                color: #333;
                margin: 0;
            }

            .upload-text .secondary-text {
                font-size: 14px;
                color: #666;
                margin: 5px 0 0 0;
            }

            .upload-btn {
                background: #8B4513;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .upload-btn:hover {
                background: #A0522D;
            }

            .preview-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }

            .image-preview {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                background: #f5f5f5;
                border: 1px solid #ddd;
            }

            .preview-image {
                width: 100%;
                height: 120px;
                object-fit: cover;
                display: block;
            }

            .preview-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-preview:hover .preview-overlay {
                opacity: 1;
            }

            .preview-actions {
                display: flex;
                gap: 10px;
            }

            .preview-btn {
                background: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .preview-btn:hover {
                transform: scale(1.1);
            }

            .preview-btn.remove {
                color: #dc3545;
            }

            .preview-btn.upload {
                color: #28a745;
            }

            .upload-progress {
                margin-top: 20px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #ddd;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }

            .progress-fill {
                height: 100%;
                background: #8B4513;
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .progress-text {
                text-align: center;
                font-size: 14px;
                color: #666;
            }

            .error-message {
                color: #dc3545;
                font-size: 14px;
                margin-top: 10px;
                padding: 10px;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
            }

            .success-message {
                color: #28a745;
                font-size: 14px;
                margin-top: 10px;
                padding: 10px;
                background: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        if (!uploadZone || !fileInput || !uploadBtn) return;

        // Click to open file dialog
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    handleFiles(fileList) {
        const files = Array.from(fileList);

        // Validate files
        const validFiles = files.filter(file => this.validateFile(file));
        const invalidFiles = files.filter(file => !this.validateFile(file));

        if (invalidFiles.length > 0) {
            this.showError(`Some files were rejected: ${invalidFiles.map(f => f.name).join(', ')}`);
        }

        // Check total file count
        if (this.files.length + validFiles.length > this.options.maxFiles) {
            this.showError(`Maximum ${this.options.maxFiles} files allowed`);
            return;
        }

        // Add valid files
        validFiles.forEach(file => {
            this.files.push(file);
            this.createPreview(file);
        });
    }

    validateFile(file) {
        // Check file type
        if (!this.options.acceptedTypes.includes(file.type)) {
            return false;
        }

        // Check file size
        if (file.size > this.options.maxSize) {
            return false;
        }

        return true;
    }

    createPreview(file) {
        const previewContainer = document.getElementById('previewContainer');
        if (!previewContainer) return;

        const previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview';
        previewDiv.dataset.fileName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}" class="preview-image">
                <div class="preview-overlay">
                    <div class="preview-actions">
                        <button class="preview-btn remove" title="Remove" data-action="remove">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="preview-btn upload" title="Upload" data-action="upload">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </button>
                    </div>
                </div>
            `;

            // Bind preview actions
            previewDiv.querySelector('[data-action="remove"]').addEventListener('click', () => {
                this.removeFile(file.name);
                previewDiv.remove();
            });

            previewDiv.querySelector('[data-action="upload"]').addEventListener('click', () => {
                this.uploadFile(file);
            });
        };

        reader.readAsDataURL(file);
        previewContainer.appendChild(previewDiv);
    }

    removeFile(fileName) {
        this.files = this.files.filter(file => file.name !== fileName);
    }

    async uploadFile(file) {
        try {
            // Show progress
            this.showProgress();

            // Compress image if needed
            const compressedFile = await this.compressImage(file);

            // Upload to cloud storage (placeholder - implement based on your service)
            const uploadUrl = await this.uploadToCloud(compressedFile);

            // Add to uploaded URLs
            this.uploadedUrls.push(uploadUrl);

            // Update progress
            this.updateProgress(100, 'Upload complete!');

            // Hide progress after delay
            setTimeout(() => this.hideProgress(), 2000);

            // Call success callback
            this.options.onUpload(uploadUrl, file.name);

        } catch (error) {
            this.showError(`Upload failed: ${error.message}`);
            this.hideProgress();
            this.options.onError(error);
        }
    }

    async compressImage(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions (max 1200px width/height)
                const maxSize = 1200;
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

                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    async uploadToCloud(file) {
        // Placeholder - implement based on your cloud storage service
        // Examples: Cloudinary, Uploadcare, AWS S3, etc.

        // For now, return a placeholder URL
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate upload success
                const mockUrl = `https://example.com/uploads/${Date.now()}-${file.name}`;
                resolve(mockUrl);
            }, 2000);
        });
    }

    async uploadAll() {
        if (this.files.length === 0) {
            this.showError('No files to upload');
            return;
        }

        this.showProgress();

        try {
            const uploadPromises = this.files.map((file, index) => {
                return this.uploadFile(file).then(url => {
                    this.updateProgress(((index + 1) / this.files.length) * 100);
                    return url;
                });
            });

            const urls = await Promise.all(uploadPromises);
            this.updateProgress(100, 'All uploads complete!');
            setTimeout(() => this.hideProgress(), 3000);

            return urls;
        } catch (error) {
            this.showError(`Batch upload failed: ${error.message}`);
            this.hideProgress();
            throw error;
        }
    }

    showProgress() {
        const progress = document.getElementById('uploadProgress');
        if (progress) progress.style.display = 'block';
    }

    hideProgress() {
        const progress = document.getElementById('uploadProgress');
        if (progress) progress.style.display = 'none';
    }

    updateProgress(percent, text = null) {
        const fill = document.getElementById('progressFill');
        const textEl = document.getElementById('progressText');

        if (fill) fill.style.width = `${percent}%`;
        if (textEl && text) textEl.textContent = text;
    }

    showError(message) {
        const container = document.querySelector(this.options.container);
        if (!container) return;

        // Remove existing error
        const existingError = container.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        container.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }

    showSuccess(message) {
        const container = document.querySelector(this.options.container);
        if (!container) return;

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        container.appendChild(successDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => successDiv.remove(), 5000);
    }

    getUploadedUrls() {
        return this.uploadedUrls;
    }

    clear() {
        this.files = [];
        this.uploadedUrls = [];
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) previewContainer.innerHTML = '';
    }
}

// Export for use in other modules
export default ImageUploader;