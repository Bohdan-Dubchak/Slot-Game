import { Container, Graphics, type Sprite, Text, TextStyle } from "pixi.js";
import { ReelsContainer } from "../reels/ReelsContainer";
import { SpinButton } from "../ui/SpinButton";
import { BetButton } from "../ui/BetButton";

export class GameScene extends Container {
    private reelsContainer!: ReelsContainer;

    private balance: number = 100;
    private bet: number = 5;

    private balanceText!: Text;
    private betText!: Text;

    private winText!: Text;

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

    // 🎯 Анімація виграшу
    private animateWinSymbols(symbols: Sprite[]): void {
        symbols.forEach((sprite) => {
            const originalScale = sprite.scale.x;

            sprite.scale.set(originalScale * 0.9);

            setTimeout(() => {
                sprite.scale.set(originalScale);
            }, 300);
        });
    }

    private createBackground(): void {
        const bg = new Graphics();
        bg.rect(0, 0, 800, 600);
        bg.fill(0x1e1e1e);

        this.addChild(bg);
    }

    // ✅ ТЕПЕР ВСЕ ЧЕРЕЗ ReelsContainer
    private createReels(): void {
        this.reelsContainer = new ReelsContainer(3);

        this.reelsContainer.position.set(200, 50);

        this.addChild(this.reelsContainer);
    }

    private createUI(): void {
        // ➕
        const plusButton = new BetButton("+", () => {
            this.bet += 5;
            if (this.bet > this.balance) this.bet = this.balance;
            this.updateHUD();
        });

        // ➖
        const minusButton = new BetButton("-", () => {
            this.bet -= 5;
            if (this.bet < 5) this.bet = 5;
            this.updateHUD();
        });

        plusButton.position.set(200, 500);
        minusButton.position.set(20, 500);

        this.addChild(plusButton, minusButton);

        // 🎰 SPIN
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            if (this.balance < this.bet) {
                console.log("❌ Not enough balance");
                return;
            }

            this.winLineGraphics.clear();

            this.balance -= this.bet;
            this.updateHUD();

            this.reelsContainer.spinAll(() => {
                this.checkWin();
            });
        });

        spinButton.position.set(325, 500);
        this.addChild(spinButton);
    }

    private createHUD(): void {
        const winStyle = new TextStyle({
            fontSize: 48,
            fill: "#ffd700",
            fontWeight: "bold",
        });

        this.winText = new Text({
            text: "",
            style: winStyle,
        });

        this.winText.anchor.set(0.5);
        this.winText.position.set(400, 300);
        this.winText.visible = false;

        this.addChild(this.winText);

        //--------------------------------

        const style = new TextStyle({
            fontSize: 20,
            fill: "#ffffff",
            fontWeight: "bold",
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

    private showWin(amount: number): void {
        this.winText.text = `WIN +${amount}`;
        this.winText.visible = true;

        this.winText.alpha = 0;
        this.winText.scale.set(0.5);

        let step = 0;

        const interval = setInterval(() => {
            step++;

            this.winText.alpha += 0.1;
            this.winText.scale.x += 0.05;
            this.winText.scale.y += 0.05;

            if (step > 10) {
                clearInterval(interval);

                setTimeout(() => {
                    this.winText.visible = false;
                }, 1500);
            }
        }, 30);
    }

    private updateHUD(): void {
        this.balanceText.text = `Balance: ${this.balance}`;
        this.betText.text = `Bet: ${this.bet}`;
    }

    private paytable: Record<string, number> = {
        cherry: 2,
        lemon: 3,
        bar: 5,
        seven: 10,
    };

    private checkWin(): void {
        const reels = this.reelsContainer.getReels();

        const matrix = reels.map((reel) => reel.getVisibleSymbols());

        const paylines = [
            [0, 0, 0],
            [1, 1, 1],
            [2, 2, 2],
        ];

        let totalWin = 0;

        paylines.forEach((line) => {
            const symbols = line.map((row, reelIndex) => matrix[reelIndex][row]);

            const isWin = symbols.every((s) => s === symbols[0]);

            if (isWin) {
                this.drawWinLine(line[0]);

                const symbol = symbols[0];
                const multiplier = this.paytable[symbol] || 0;

                const win = this.bet * multiplier;
                totalWin += win;

                // 🎯 отримуємо спрайти
                const winSprites = reels.map((reel, i) =>
                    reel.getVisibleSymbolsSprites()[line[i]]
                );

                this.animateWinSymbols(winSprites);
            }
        });

        if (totalWin > 0) {
            this.balance += totalWin;
            this.updateHUD();
            this.showWin(totalWin);
        } else {
            console.log("❌ LOSE");
        }
    }

    private drawWinLine(row: number): void {
        this.winLineGraphics.clear();

        const startX = 200;
        const gap = 205;
        const y = 50 + row * 105 + 55;

        this.winLineGraphics.moveTo(startX, y);
        this.winLineGraphics.lineTo(startX + gap * 2, y);

        this.winLineGraphics.stroke({
            width: 5,
            color: 0xffff00,
        });
    }
}