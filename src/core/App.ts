import {Application, type Renderer} from 'pixi.js';

export class App {
    private app: Application<Renderer>;
    constructor() {
        this.app = new Application();
    }

    async init() {
        await this.app.init({
            width: 800,
            height: 600,
            background: '#1099bb'
        });

        document.body.appendChild(this.app.canvas);
    }

    get stage() {
        return this.app.stage;
    }
}