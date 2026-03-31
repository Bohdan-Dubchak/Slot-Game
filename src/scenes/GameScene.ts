import { Container, Graphics } from "pixi.js";
import {Reel} from "../reels/Reels.ts";
import { SpinButton } from "../ui/SpinButton";

export class GameScene extends Container {
    private reels: Reel[] = [];
    private reelCount = 3;

    constructor() {
        super();

        this.createBackground();
        this.createReels();
        this.createUI();
    }

    private createBackground(): void {
        const bg = new Graphics();
        bg.rect(0, 0, 800, 600);
        bg.fill(0x1e1e1e);

        this.addChild(bg);
    }

    private createReels(): void {
        const startX = 200;
        const gap = 150;

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel();

            reel.position.set(startX + i * gap, 50);

            this.addChild(reel);
            this.reels.push(reel);
        }
    }

    private createUI(): void {
        const spinButton = new SpinButton(() => {
            const isAnySpinning = this.reels.some(r => r.getIsSpinning());
            if (isAnySpinning) return;

            this.reels.forEach((reel, index) => {
                reel.spin();

                setTimeout(() => {
                    reel.stop();

                    if (index === this.reels.length - 1) {
                        setTimeout(() => {
                            this.checkWin();
                        }, 300);
                    }

                }, 1500 + index * 500);
            });
        });

        spinButton.position.set(325, 500);
        this.addChild(spinButton);
    }

    private checkWin(): void {
        const results = this.reels.map(r => r.getMiddleSymbol());

        console.log("RESULT:", results);

        const isWin = results.every(s => s === results[0]);

        if (isWin) {
            console.log("🎉 WIN!");
        } else {
            console.log("❌ LOSE");
        }
    }
}