import { Timeline } from './timeline.js';
import { Coordinates } from './coordinates.js';
import '../css/style.css';

class App {
    constructor() {
        this.timeline = new Timeline('timeline');
        this.modal = document.getElementById('coordinatesModal');
        this.coordinatesInput = document.getElementById('coordinatesInput');
        this.confirmBtn = document.getElementById('confirmCoordinates');
        this.cancelBtn = document.getElementById('cancelCoordinates');
        this.errorMessage = document.getElementById('coordinatesError');
        
        this.pendingText = null;
        this.initEventListeners();
    }

    initEventListeners() {
        const textInput = document.getElementById('textInput');
        
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleTextInput(textInput.value.trim());
                textInput.value = '';
            }
        });

        this.confirmBtn.addEventListener('click', () => this.handleManualCoordinates());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        
        this.coordinatesInput.addEventListener('input', () => {
            this.hideError();
        });
    }

    async handleTextInput(text) {
        if (!text) return;

        this.pendingText = text;

        try {
            const coords = await Coordinates.getCurrentPosition();
            this.addPostWithCoordinates(text, coords);
        } catch (error) {
            this.showCoordinatesModal();
        }
    }

    async handleManualCoordinates() {
        const input = this.coordinatesInput.value.trim();
        
        try {
            const coords = Coordinates.parseCoordinates(input);
            this.addPostWithCoordinates(this.pendingText, coords);
            this.closeModal();
        } catch (error) {
            this.showError(error.message);
        }
    }

    addPostWithCoordinates(text, coords) {
        this.timeline.addPost(text, {
            latitude: coords.latitude,
            longitude: coords.longitude,
            toString: function() {
                return `${this.latitude.toFixed(5)}, ${this.longitude.toFixed(5)}`;
            }
        });
        this.pendingText = null;
    }

    showCoordinatesModal() {
        this.modal.style.display = 'block';
        this.coordinatesInput.value = '';
        this.hideError();
        this.coordinatesInput.focus();
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.pendingText = null;
        this.hideError();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});