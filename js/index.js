import { App } from "./app.js";


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    
    new App(canvas);
})