import {Container, Graphics} from "pixi.js";

export class GameScene extends Container {
    constructor() {
        super();

        this.createBackground();
    }

    private createBackground() {
        const bg = new Graphics();
        bg.rect(0,0,800,600);
        bg.fill(0x1e1e1e);

        this.addChild(bg);
    }
}