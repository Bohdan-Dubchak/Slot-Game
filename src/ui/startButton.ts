import { Container, Rectangle, Assets, Sprite } from "pixi.js";
import { gsap } from "gsap";

export class StartButton extends Container {
    constructor(onClick: () => void) {
        super();

       this.eventMode = 'static';
       this.cursor = 'pointer';

       const texture = Assets.get('/assets/Button/Start.png');
       const bg = new Sprite(texture);

       bg.anchor.set(0.5);
       bg.position.set(bg.x = 80, bg.y = 100);
       bg.width = 300;
       bg.height = 120;


        bg.anchor.set(0.5);
        bg.x = bg.x;
        bg.y = bg.y;

        this.addChild(bg);

        // hitArea на контейнері, враховуємо позицію bg
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
