import {Application,  type Renderer, Container} from 'pixi.js';
import {GameScene} from "../scenes/GameScene.ts";
import {MenuScene} from "../scenes/MenuScene.ts";
import {LoadingScene} from "../scenes/LoadingScene.ts";
import {Loader} from "./Loader.ts";
import { loadSounds} from "../systems/Sound.ts";

export class App {
    private app: Application<Renderer>;
    private currentScene: Container | null = null;
    constructor() {
        this.app = new Application();
    }

    async init() {
        await this.app.init({
            width: 800,
            height: 600,
            background: '#0c0c1e',
            backgroundAlpha: 0.53
        });

        await loadSounds();

        // застосовуємо стиль до canvas
        this.app.canvas.style.borderRadius = '20px';
        this.app.canvas.style.overflow = 'hidden';

        const loadingScene = new LoadingScene();
        this.app.stage.addChild(loadingScene);

        await loadFonts();

        await Loader.load((progress) => {
            loadingScene.updateProgress(progress);

        })

        document.body.appendChild(this.app.canvas);

        this.showMenu();

    }

    private showMenu(): void {
        this.clearScene();

        const menu = new MenuScene(() => {
            this.startGame();
        });

        this.currentScene = menu;
        this.app.stage.addChild(menu);
    }

    private startGame(): void {
        this.clearScene();

        const gameScene = new GameScene();
        this.currentScene = gameScene;

        this.app.stage.addChild(gameScene);
    }

    private clearScene(): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }
    }

    get stage() {
        return this.app.stage;
    }

}

async function loadFonts() {
    await document.fonts.load('150px "lugio"');
}
