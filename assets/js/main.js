import UIManager from './uiManager.js';

document.addEventListener("DOMContentLoaded", function () {
   
    const uiManager = new UIManager();
    
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        uiManager.startScheduler();
    });

    form.addEventListener('reset', function (event) {
        event.preventDefault();
        uiManager.handleReset();
    });
});
