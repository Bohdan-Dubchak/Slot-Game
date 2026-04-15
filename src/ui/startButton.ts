import { Container, Rectangle, Assets, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { sound } from "@pixi/sound";

export class StartButton extends Container {
    constructor(onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const texture = Assets.get('/assets/Button/Start.png');
        const bg = new Sprite(texture);

        bg.anchor.set(0.5);
        bg.position.set(80, 100);
        bg.width = 300;
        bg.height = 120;

        this.addChild(bg);

        this.hitArea = new Rectangle(
            bg.x - bg.width / 2,
            bg.y - bg.height / 2,
            bg.width,
            bg.height
        );

        this.on('pointerdown', async () => {
            if (sound.context.audioContext.state !== 'running') {
                await sound.context.audioContext.resume();
            }

            sound.play('Button', { singleInstance: true });

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