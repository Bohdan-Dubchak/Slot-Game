import {Container, Assets, Sprite} from "pixi.js";
import { Reel } from "./Reels.ts";

export class ReelsContainer extends Container {
    private reels: Reel[] = [];
    private reelCount: number;

    constructor(reelsCount: number) {
        super();
        // this.createFon();
        this.reelCount = reelsCount;
        this.createReels();

    }

    // @ts-ignore
    private createFon(): void {
        const texture = Assets.get("/assets/Img/Reels.png");
        const bg = new Sprite(texture);

        bg.x = 555;
        bg.y = -55;
        bg.width = 550;
        bg.height = 550;
        // bg.anchor.set(0.5);

        this.addChild(bg);
    }

    // Створює масив барабанів (reels), розставляє їх по горизонталі
    // з відступом (gap) і додає кожен барабан в контейнер сцен
    private createReels() {
        const gap = 150;

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel();

            reel.x = i * gap;
            reel.y = 30; // Додамо y позицію, як у GameScene
            this.reels.push(reel);

            this.addChild(reel);
        }
    }

    // чи хоч один барабан зараз крутиться
    public isAnySpinning(): boolean {
        return this.reels.some(reel => reel.getIsSpinning());
    }

    // Запускає всі барабани і зупиняє їх по черзі з затримкою
    public spinAll(callback: () => void) {
        this.reels.forEach((reel, index) => {
            reel.spin();

            setTimeout(() => {
                reel.stop();

                if (index === this.reels.length - 1) {
                    setTimeout(() => {
                        callback();
                    }, 300);
                }
            }, 1500 + index * 500);
        });
    }

    public getReels(): Reel[] {
        return this.reels;
    }
}