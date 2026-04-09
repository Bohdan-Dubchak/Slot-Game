import { Container, Sprite, Text, TextStyle, Assets, Rectangle } from "pixi.js";
import { gsap } from 'gsap';

export class SpinButton extends Container {
    constructor(onClick: () => void) {
        super();

        this.eventMode = "static";
        this.cursor = "pointer";

        const texture = Assets.get('/assets/Button/Spin.png');
        const bg = new Sprite(texture);

        bg.anchor.set(0.5);
        bg.x = 90;
        bg.y = 20;
        bg.width = 150;
        bg.height = 150;

        const style = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 22,
            fill: '#ffffff',
            fontWeight: 'bold',
        });

        const btnText = new Text({
            text: "",
            style: style,
        });

        btnText.anchor.set(0.5);
        btnText.x = bg.x;
        btnText.y = bg.y;

        this.addChild(bg, btnText);

        // ✅ hitArea на контейнері, враховуємо позицію bg
        this.hitArea = new Rectangle(
            bg.x - bg.width / 2,   // 90 - 100 = -10
            bg.y - bg.height / 2,  // 20 - 100 = -80
            bg.width,              // 200
            bg.height              // 200
        );

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