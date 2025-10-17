export class Coordinates {
    static parseCoordinates(input) {
        if (!input || typeof input !== 'string') {
            throw new Error('Введите координаты');
        }

        const cleanedInput = input
            .replace(/\s*,\s*/g, ',')
            .replace(/[\[\]]/g, '')
            .trim();

        const parts = cleanedInput.split(',');
        
        if (parts.length !== 2) {
            throw new Error('Координаты должны содержать широту и долготу, разделенные запятой');
        }

        const latitude = parseFloat(parts[0]);
        const longitude = parseFloat(parts[1]);

        if (isNaN(latitude) || isNaN(longitude)) {
            throw new Error('Широта и долгота должны быть числами');
        }

        if (latitude < -90 || latitude > 90) {
            throw new Error('Широта должна быть в диапазоне от -90 до 90');
        }

        if (longitude < -180 || longitude > 180) {
            throw new Error('Долгота должна быть в диапазоне от -180 до 180');
        }

        return {
            latitude,
            longitude,
            toString() {
                return `${this.latitude.toFixed(5)}, ${this.longitude.toFixed(5)}`;
            }
        };
    }

    static async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation не поддерживается'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error('Не удалось получить координаты'));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }
}