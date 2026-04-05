import { Container } from "pixi.js";
import { Reel } from "./Reels.ts";

export class ReelsContainer extends Container {
    private reels: Reel[] = [];
    private reelCount: number;

    constructor(reelsCount: number) {
        super();
        this.reelCount = reelsCount;
        this.createReels();
    }

    private createReels() {
        const gap = 150;

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel();

            reel.x = i * gap;
            reel.y = 50; // Додамо y позицію, як у GameScene
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