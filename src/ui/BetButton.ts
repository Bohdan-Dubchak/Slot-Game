import {Container, Assets, Sprite, Rectangle} from "pixi.js";
import {gsap} from "gsap";

export class BetButton extends Container{
    constructor(texturePath: string, onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const button = Assets.get(texturePath);
        const bg = new Sprite(button);

        bg.anchor.set(0.5);
        bg.position.set(bg.x = 20, bg.y = 25);
        bg.width = 50;
        bg.height = 50;

        bg.x = bg.x;
        bg.y = bg.y;


        // hitArea на контейнері, враховуємо позицію bg
        this.hitArea = new Rectangle(
            bg.x - bg.width / 2,   // 90 - 100 = -10
            bg.y - bg.height / 2,  // 20 - 100 = -80
            bg.width,              // 200
            bg.height              // 200
        );

        this.addChild(bg, );

        this.on('pointerdown', onClick);

        this.on('pointerdown', () => {
            gsap.to(this.scale, { x: 0.95, y: 0.95, duration: 0.1 });
        });

        this.on('pointerup', () => {
            gsap.to(this.scale, { x: 1, y: 1, duration: 0.1 });
        });

        this.on('pointerupoutside', () => {
            gsap.to(this.scale, { x: 1, y: 1, duration: 0.1 });
        });
    }



}