import {Application,  type Renderer,} from 'pixi.js';
import {GameScene} from "../scenes/GameScene.ts";
import {Loader} from "./Loader.ts";

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

        // чекаємо завантаження ресурсів
        await Loader.load();


        this.start();
    }

    private start(): void {
        const gameScene = new GameScene();
        this.app.stage.addChild(gameScene);
    }

    get stage() {
        return this.app.stage;
    }
}