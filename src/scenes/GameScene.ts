import {Container, Graphics} from "pixi.js";
import {Reel} from "../reels/Reels.ts";

export class GameScene extends Container {
    constructor() {
        super();

        this.createBackground();
        this.createReel();
    }

    private createBackground() {
        const bg = new Graphics();
        bg.rect(0,0,800,600);
        bg.fill(0x1e1e1e);

        this.addChild(bg);
    }

    private createReel(): void {
        const reel = new Reel();
        reel.position.set(reel.x = 350, reel.y = 50);

        this.addChild(reel);
    }
}