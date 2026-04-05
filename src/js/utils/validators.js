// Validation Functions
export function validateEmail(email) {
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    } else if (!isValidEmailFormat(email)) {
        errors.push('Please enter a valid email address');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validatePassword(password) {
    const errors = [];
    const minLength = 8;

    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < minLength) {
            errors.push(`Password must be at least ${minLength} characters long`);
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validatePhone(phone) {
    const errors = [];

    if (!phone) {
        errors.push('Phone number is required');
    } else if (!isValidPhoneFormat(phone)) {
        errors.push('Please enter a valid phone number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateRequired(value, fieldName) {
    const errors = [];

    if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push(`${fieldName} is required`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateMinLength(value, minLength, fieldName) {
    const errors = [];

    if (value && value.length < minLength) {
        errors.push(`${fieldName} must be at least ${minLength} characters long`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateMaxLength(value, maxLength, fieldName) {
    const errors = [];

    if (value && value.length > maxLength) {
        errors.push(`${fieldName} must not exceed ${maxLength} characters`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateNumeric(value, fieldName) {
    const errors = [];

    if (value && isNaN(value)) {
        errors.push(`${fieldName} must be a valid number`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateUrl(url) {
    const errors = [];

    if (url && !isValidUrlFormat(url)) {
        errors.push('Please enter a valid URL');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Helper functions
function isValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneFormat(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function isValidUrlFormat(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function validateForm(formData, rules) {
    const errors = {};

    Object.entries(rules).forEach(([field, fieldRules]) => {
        const value = formData[field];
        const fieldErrors = [];

        fieldRules.forEach(rule => {
            const result = rule.validator(value, rule.param);
            if (!result.isValid) {
                fieldErrors.push(...result.errors);
            }
        });

        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}