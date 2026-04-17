import {Container, Assets, Sprite} from "pixi.js";
import { Reel } from "./Reels.ts";

export class ReelsContainer extends Container {
    private reels: Reel[] = [];
    private reelCount: number;
    private REEL_GAP = 150;

    constructor(reelsCount: number) {
        super();
        this.reelCount = reelsCount;
        this.createReels();
        // this.createFon();
    }

    // @ts-ignore
    private createFon(): void {
        const texture = Assets.get("/assets/Img/Reels.png");
        const bg = new Sprite(texture);

        const totalReelsWidth = (this.reelCount - 1) * this.REEL_GAP;

        // Центруємо рамку
        bg.anchor.set(0.5, 0.5);
        bg.position.set(
            totalReelsWidth / 2,
            200
        );

        // Встановлюємо розмір напряму
        bg.width = 500;
        bg.height = 800;

        this.addChildAt(bg, 0);
    }

    private createReels() {
        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel();

            reel.x = i * this.REEL_GAP;
            reel.y = 30;
            this.reels.push(reel);

            this.addChild(reel);
        }
    }

    public isAnySpinning(): boolean {
        return this.reels.some(reel => reel.getIsSpinning());
    }

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