export class Validation {
    /**
     * Валидация текстового контента
     * @param {string} text - Текст для проверки
     * @param {number} maxLength - Максимальная длина текста
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    static validateTextContent(text, maxLength = 1000) {
        const errors = [];

        if (!text || typeof text !== 'string') {
            errors.push('Текст не может быть пустым');
        } else {
            const trimmedText = text.trim();
            
            if (trimmedText.length === 0) {
                errors.push('Текст не может состоять только из пробелов');
            }
            
            if (trimmedText.length > maxLength) {
                errors.push(`Текст не может превышать ${maxLength} символов`);
            }

            if (trimmedText.length < 2) {
                errors.push('Текст должен содержать хотя бы 2 символа');
            }
            
            const hasMeaningfulContent = /[a-zA-Zа-яА-Я0-9]/.test(trimmedText);
            if (!hasMeaningfulContent) {
                errors.push('Текст должен содержать буквы или цифры');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Валидация координат
     * @param {number} latitude - Широта
     * @param {number} longitude - Долгота
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    static validateCoordinates(latitude, longitude) {
        const errors = [];

        if (typeof latitude !== 'number' || isNaN(latitude)) {
            errors.push('Широта должна быть числом');
        } else if (latitude < -90 || latitude > 90) {
            errors.push('Широта должна быть в диапазоне от -90 до 90');
        }

        if (typeof longitude !== 'number' || isNaN(longitude)) {
            errors.push('Долгота должна быть числом');
        } else if (longitude < -180 || longitude > 180) {
            errors.push('Долгота должна быть в диапазоне от -180 до 180');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Валидация URL для медиа-файлов
     * @param {string} url - URL для проверки
     * @param {string} type - Тип медиа ('audio' или 'video')
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    static validateMediaUrl(url, type = 'audio') {
        const errors = [];

        if (!url || typeof url !== 'string') {
            errors.push('URL не может быть пустым');
            return { isValid: false, errors };
        }

        try {
            new URL(url);
        } catch (error) {
            errors.push('Некорректный URL');
        }

        const allowedAudioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
        const allowedVideoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        
        const allowedExtensions = type === 'audio' ? allowedAudioExtensions : allowedVideoExtensions;
        const hasValidExtension = allowedExtensions.some(ext => 
            url.toLowerCase().includes(ext)
        );

        if (!hasValidExtension) {
            const extensions = allowedExtensions.join(', ');
            errors.push(`URL должен содержать одно из разрешенных расширений: ${extensions}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Валидация даты
     * @param {Date} date - Дата для проверки
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    static validateDate(date) {
        const errors = [];

        if (!(date instanceof Date)) {
            errors.push('Должен быть объект Date');
        } else if (isNaN(date.getTime())) {
            errors.push('Некорректная дата');
        } else if (date > new Date()) {
            errors.push('Дата не может быть в будущем');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Валидация размера файла
     * @param {number} size - Размер файла в байтах
     * @param {number} maxSize - Максимальный размер в байтах
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    static validateFileSize(size, maxSize = 50 * 1024 * 1024) { // 50MB по умолчанию
        const errors = [];

        if (typeof size !== 'number' || isNaN(size)) {
            errors.push('Размер файла должен быть числом');
        } else if (size <= 0) {
            errors.push('Размер файла должен быть положительным числом');
        } else if (size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
            errors.push(`Размер файла не должен превышать ${maxSizeMB} MB`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Универсальная функция валидации формы
     * @param {Object} fields - Объект с полями для валидации
     * @param {Object} rules - Правила валидации
     * @returns {Object} {isValid: boolean, errors: Object}
     */
    static validateForm(fields, rules) {
        const errors = {};
        let isValid = true;

        Object.keys(rules).forEach(fieldName => {
            const value = fields[fieldName];
            const fieldRules = rules[fieldName];
            const fieldErrors = [];

            fieldRules.forEach(rule => {
                const error = this.validateRule(value, rule);
                if (error) {
                    fieldErrors.push(error);
                }
            });

            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
                isValid = false;
            }
        });

        return { isValid, errors };
    }

    /**
     * Валидация по правилу
     * @param {any} value - Значение для проверки
     * @param {Object} rule - Правило валидации
     * @returns {string|null} Сообщение об ошибке или null
     */
    static validateRule(value, rule) {
        const { type, params = {} } = rule;

        switch (type) {
            case 'required':
                if (!value && value !== 0) {
                    return params.message || 'Поле обязательно для заполнения';
                }
                break;

            case 'minLength':
                if (value && value.length < params.value) {
                    return params.message || `Минимальная длина: ${params.value} символов`;
                }
                break;

            case 'maxLength':
                if (value && value.length > params.value) {
                    return params.message || `Максимальная длина: ${params.value} символов`;
                }
                break;

            case 'pattern':
                if (value && !params.regex.test(value)) {
                    return params.message || 'Некорректный формат';
                }
                break;

            case 'custom':
                if (params.validator && !params.validator(value)) {
                    return params.message || 'Некорректное значение';
                }
                break;
        }

        return null;
    }

    /**
     * Очистка и нормализация текста
     * @param {string} text - Текст для очистки
     * @returns {string} Очищенный текст
     */
    static sanitizeText(text) {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .trim()
            .replace(/\s+/g, ' ') 
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .slice(0, 1000);
    }

    /**
     * Проверка поддержки медиа-форматов браузером
     * @param {string} type - Тип медиа ('audio' или 'video')
     * @param {string} format - Формат ('mp3', 'mp4', etc.)
     * @returns {boolean} Поддерживается ли формат
     */
    static isMediaFormatSupported(type, format) {
        const audioFormats = {
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            ogg: 'audio/ogg',
            m4a: 'audio/mp4'
        };

        const videoFormats = {
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogg: 'video/ogg'
        };

        const formats = type === 'audio' ? audioFormats : videoFormats;
        const mimeType = formats[format.toLowerCase()];

        if (!mimeType) return false;

        const mediaElement = type === 'audio' ? 
            document.createElement('audio') : 
            document.createElement('video');

        return mediaElement.canPlayType(mimeType) !== '';
    }
}

export const Validators = {
    required: (message = 'Поле обязательно для заполнения') => ({
        type: 'required',
        params: { message }
    }),

    minLength: (length, message) => ({
        type: 'minLength',
        params: { value: length, message: message || `Минимальная длина: ${length} символов` }
    }),

    maxLength: (length, message) => ({
        type: 'maxLength',
        params: { value: length, message: message || `Максимальная длина: ${length} символов` }
    }),

    pattern: (regex, message = 'Некорректный формат') => ({
        type: 'pattern',
        params: { regex, message }
    }),

    custom: (validator, message = 'Некорректное значение') => ({
        type: 'custom',
        params: { validator, message }
    })
};