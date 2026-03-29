import {Application} from "pixi.js";

const app: Application = new Application();
await app.init({
    width: 800,
    height: 600,
    background: '#1099bb',
});

document.body.appendChild(app.canvas);