import {Assets, Rectangle, Sprite, Container } from "pixi.js";
import {gsap} from "gsap";

export class AutoSpinButton extends Container  {
    constructor(onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = "pointer";

        const texture = Assets.get('/assets/Button/AutoSpin.png');
        const bg = new Sprite(texture);

        bg.anchor.set(0.5);
        bg.x = 90;
        bg.y = 20;
        bg.width = 120;
        bg.height = 120;

        this.addChild(bg);

        this.hitArea = new Rectangle(
            bg.x - bg.width / 2,
            bg.y - bg.height / 2,
            bg.width,
            bg.height
        );

        this.on('pointerdown', (): void => {
            gsap.to(this.scale, { x: 0.95, y: 0.95, duration: 0.1 });
            onClick();
        });

        this.on('pointerup', () => {
            gsap.to(this.scale, { x: 1, y: 1, duration: 0.1 });
        });

        this.on('pointerupoutside', () => {
            gsap.to(this.scale, { x: 1, y: 1, duration: 0.1 });
        });
    }
}