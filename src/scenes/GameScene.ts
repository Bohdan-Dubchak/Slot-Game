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
        // отримуємо матрицю:
        // [
        //   [r1_top, r1_mid, r1_bot],
        //   [r2_top, r2_mid, r2_bot],
        //   [r3_top, r3_mid, r3_bot]
        // ]
        const matrix = this.reels.map(reel => reel.getVisibleSymbols());

        console.log("Matrix ", matrix);

        const playlines = [
            [0, 0, 0], // верхня
            [1, 1, 1], // середня
            [2, 2, 2], // нижня
        ];

        let winLines = 0;

        playlines.forEach((line, index) => {
            const symbols = line.map((row, reelIndex) => matrix[reelIndex][row]);

            const isWin = symbols.every(s => s === symbols[0]);

            if (isWin) {
                winLines++;
                console.log(`🎉 WIN LINE ${index + 1}`, symbols);
            }
        });

        if (winLines === 0) {
            console.log("❌ LOSE");
        }
    }
}