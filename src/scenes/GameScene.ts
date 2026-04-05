import {Container, Graphics, type Sprite, Text, TextStyle} from "pixi.js";
import {Reel} from "../reels/Reels.ts";
import { SpinButton } from "../ui/SpinButton";
import { BetButton} from "../ui/BetButton.ts";

export class GameScene extends Container {
    private reels: Reel[] = [];
    private reelCount = 3;

    private balance: number = 100;
    private bet: number = 5;

    private balanceText!: Text;
    private betText!: Text;

    private winLineGraphics: Graphics;

    constructor() {
        super();

        this.createBackground();
        this.createReels();
        this.createUI();
        this.createHUD();

        this.winLineGraphics = new Graphics();
        this.addChild(this.winLineGraphics);
    }

    // Анімація виграшу
    private animateWinSymbols(symbols: Sprite[]): void {
        // Анімація: пульсація всіх символів в лінії
        symbols.forEach((sprite) => {
            const originalScale = sprite.scale.x;

            const pulse = () => {
                sprite.scale.set(originalScale * 0.9);
                setTimeout(() => {
                    sprite.scale.set(originalScale);
                }, 300)
            }

            pulse();
        })
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

        // нові кнопки ставки
        const plusButton = new BetButton('+', () => {
            this.bet += 5; // Збільшує ставку на 5
            if (this.bet > this.balance) this.bet = this.balance + 5; // не більше балансу
            this.updateHUD();
        });

        const minusButton = new BetButton("-", () => {
            this.bet -= 5;
            if (this.bet < 5) this.bet = 5
            this.updateHUD();
        });

        plusButton.position.set(200, 500);
        minusButton.position.set(20, 500);

        this.addChild(plusButton, minusButton);

        const spinButton = new SpinButton(() => {
            const isAnySpinning = this.reels.some(r => r.getIsSpinning());
            if (isAnySpinning) return;

            // ❗ перевірка балансу
            if (this.balance < this.bet) {
                console.log('❌ Not enough balance');
                return;
            }

        this.winLineGraphics.clear();

            // списуємо ставку
            this.balance -= this.bet;
            this.updateHUD()
            console.log("Balance: ", this.balance);

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

    private createHUD(): void {
        const style = new TextStyle({
            fontSize: 20,
            fill: '#ffffff',
            fontWeight: 'bold',
        });

        this.balanceText = new Text({
            text: `Balance: ${this.balance}`,
            style,
        });

        this.betText = new Text({
            text: `Bet: ${this.bet}`,
            style,
        });

        this.balanceText.position.set(600, 512);
        this.betText.position.set(80, 512);

        this.addChild(this.balanceText, this.betText);
    }

    private updateHUD(): void {
        this.balanceText.text = `Balance: ${this.balance}`;
        this.betText.text = `Bet: ${this.bet}`
    }

    private paytabl: Record<string, number> = {
        cherry: 2,
        lemon: 3,
        bar: 5,
        seven: 10,
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

        let totalWin = 0;

        playlines.forEach((line) => {
            const symbols = line.map((row, reelIndex) => matrix[reelIndex][row]);

            const isWin = symbols.every(s => s === symbols[0]);

            if (isWin) {
                this.drawWinLine(line[0]);

               const symbol = symbols[0];
               const multiplier = this.paytabl[symbol] || 0;

               const win = this.bet * multiplier;

               totalWin += win;

                // отримати спрайти для анімації
                const winSprites = this.reels.map((reel, i) => reel.getVisibleSymbolsSprites()[line[i]]);

                this.animateWinSymbols(winSprites);

                console.log(`🎉 WIN: ${symbol} x${multiplier} = ${win}`);
            }
        });

        if (totalWin > 0) {
            this.balance += totalWin;
            this.updateHUD();
            console.log("💰 TOTAL WIN:", totalWin);
        } else {
            console.log("❌ LOSE")
        }
        console.log("BALANCE:", this.balance);
    }

    private drawWinLine(row: number): void {
        this.winLineGraphics.clear();

        const startX = 200;
        const gap = 205;
        const y = 50 + row * 105 + 55;

        this.winLineGraphics.moveTo(startX, y);
        this.winLineGraphics.lineTo(startX + gap * (this.reels.length - 1), y);

        this.winLineGraphics.stroke({
            width: 5,
            color: 0xffff00
        })
    }
}