import '../styles/main.css';
import { Timeline } from './timeline.js';
import { parseCoordinates } from './coordinates.js';

class App {
    constructor() {
        this.timeline = new Timeline('timeline');
        this.currentCoordinates = null;
        this.pendingText = '';
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const textInput = document.getElementById('textInput');
        const confirmBtn = document.getElementById('confirmCoordinates');
        const cancelBtn = document.getElementById('cancelCoordinates');
        const manualInput = document.getElementById('manualCoordinates');
        const modal = document.getElementById('coordinatesModal');

        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                this.handleTextInput(e.target.value.trim());
                e.target.value = '';
            }
        });

        confirmBtn.addEventListener('click', () => {
            this.handleManualCoordinates(manualInput.value.trim());
        });

        cancelBtn.addEventListener('click', () => {
            this.hideModal();
            this.pendingText = '';
        });

        manualInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleManualCoordinates(manualInput.value.trim());
            }
        });
    }

    async handleTextInput(text) {
        this.pendingText = text;
        
        try {
            const coordinates = await this.getCurrentPosition();
            this.addTextPost(text, coordinates);
        } catch (error) {
            console.warn('Geolocation failed:', error);
            this.showCoordinatesModal();
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
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
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }

    handleManualCoordinates(input) {
        const errorElement = document.getElementById('coordinatesError');
        
        try {
            const coordinates = parseCoordinates(input);
            this.addTextPost(this.pendingText, coordinates);
            this.hideModal();
            errorElement.textContent = '';
        } catch (error) {
            errorElement.textContent = error.message;
        }
    }

    addTextPost(text, coordinates) {
        this.timeline.addPost(text, coordinates, 'text');
    }

    showCoordinatesModal() {
        const modal = document.getElementById('coordinatesModal');
        const manualInput = document.getElementById('manualCoordinates');
        const errorElement = document.getElementById('coordinatesError');
        
        manualInput.value = '';
        errorElement.textContent = '';
        modal.style.display = 'block';
        manualInput.focus();
    }

    hideModal() {
        const modal = document.getElementById('coordinatesModal');
        modal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});