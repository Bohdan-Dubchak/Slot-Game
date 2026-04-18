import { Container, Sprite, Text, TextStyle, Assets } from "pixi.js";
import { gsap } from "gsap";
import { animateWinSymbols } from "../animations/AnimationWinSymbols";
import { WinTextAnimation } from "../animations/AnimationShowWin";
import { ReelsContainer } from "../reels/ReelsContainer";
import { SpinButton } from "../ui/SpinButton";
import { BetButton } from "../ui/BetButton";
import { SoundToggleButton } from "../ui/SoundButton";
import { SoundManager } from "../core/SoundManager";
import { AutoSpinButton } from "../ui/AutoSpinButton";

export class GameScene extends Container {
    private reelsContainer!: ReelsContainer;

    private balance: number = 1000;
    private bet: number = 5;

    private balanceLabel!: Text;
    private balanceValue!: Text;

    private betLabel!: Text;
    private betValue!: Text;

    private winText!: WinTextAnimation;
    private soundManager!: SoundManager;

    private isAutoSpin: boolean = false;

    constructor() {
        super();
        this.init();
    }

    private async init(): Promise<void> {
        this.soundManager = new SoundManager(); // 🔥 ВАЖЛИВО

        await Assets.load('/assets/Img/BackgroundImage.png');

        this.createBackgroundImage();
        this.createBoxBet();
        this.createBoxBalance();
        this.createReels();
        this.createUI();
        this.createHUD();
    }

    private createBackgroundImage(): void {
        const texture = Assets.get('/assets/Img/BackgroundImage.png');
        const bgSprite = new Sprite(texture);

        bgSprite.width = 800;
        bgSprite.height = 600;

        this.addChild(bgSprite);
    }

    private createBoxBet(): void {
        const texture = Assets.get('/assets/frames/Rectangle.png');
        const box = new Sprite(texture);

        box.anchor.set(0.5);
        box.width = 120;
        box.height = 28;
        box.position.set(130, 525);

        this.addChild(box);
    }

    private createBoxBalance(): void {
        const texture = Assets.get('/assets/frames/Rectangle.png');
        const box = new Sprite(texture);

        box.anchor.set(0.5);
        box.width = 150;
        box.height = 28;
        box.position.set(660, 530);

        this.addChild(box);
    }

    private createReels(): void {
        this.reelsContainer = new ReelsContainer(3);
        this.reelsContainer.position.set(200, 50);

        this.addChild(this.reelsContainer);
    }

    private createUI(): void {
        let interval: any = null;

        const stop = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        // 🔊 SOUND BUTTON
        const soundButton = new SoundToggleButton();
        soundButton.position.set(740, 40);
        soundButton.width = 50;
        soundButton.height = 50;

        soundButton.on('soundToggle', () => {
            this.soundManager.toggleMuted();
        });

        this.addChild(soundButton);

        // ➕ PLUS
        const plusButton = new BetButton('/assets/Button/Plus.png', () => {
            this.bet += 5;
            if (this.bet > this.balance) this.bet = this.balance;
            this.updateHUD();
        });

        plusButton.on('pointerdown', () => {
            this.soundManager.play('Button');

            interval = setInterval(() => {
                this.bet += 5;
                if (this.bet > this.balance) this.bet = this.balance;
                this.updateHUD();
            }, 190);
        });

        plusButton.on('pointerup', stop);
        plusButton.on('pointerupoutside', stop);

        // MINUS
        const minusButton = new BetButton('/assets/Button/Minus.png', () => {
            this.bet -= 5;
            if (this.bet < 5) this.bet = 5;
            this.updateHUD();
        });

        minusButton.on('pointerdown', () => {
            this.soundManager.play('Button');

            interval = setInterval(() => {
                this.bet -= 5;
                if (this.bet < 5) this.bet = 5;
                this.updateHUD();
            }, 190);
        });

        minusButton.on('pointerup', stop);
        minusButton.on('pointerupoutside', stop);

        plusButton.position.set(200, 500);
        minusButton.position.set(20, 500);

        this.addChild(plusButton, minusButton);

        // 🎰 SPIN
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;
            if (this.balance < this.bet) return;

            this.soundManager.play('Reel', { loop: true });

            this.balance -= this.bet;
            this.updateHUD();

            this.reelsContainer.spinAll(() => {
                this.stopSpinSound();
                this.checkWin();
            });
        });

        spinButton.position.set(325, 500);
        this.addChild(spinButton);

        const autoButton = new AutoSpinButton(() => {
            this.isAutoSpin = !this.isAutoSpin;

            if (this.isAutoSpin && !this.reelsContainer.isAnySpinning()) {
                this.spin();
            }
        });

        autoButton.position.set(450, 500);
        this.addChild(autoButton);
    }

    private spin(): void {
        if (this.reelsContainer.isAnySpinning()) return;
        if (this.balance < this.bet) {
            this.isAutoSpin = false;
            return;
        }

        this.soundManager.play('Reel', { loop: true });

        this.balance -= this.bet;
        this.updateHUD();

        this.reelsContainer.spinAll(() => {
            this.stopSpinSound();
            this.checkWin();

            if (this.isAutoSpin) {
                setTimeout(() => this.spin(), 500);
            }
        });
    }

    private stopSpinSound(): void {
        this.soundManager.stop('Reel');
    }

    private createHUD(): void {
        this.winText = new WinTextAnimation();
        this.winText.position.set(400, 300);
        this.addChild(this.winText);

        const style = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 25,
            fill: "#ffffff",
            fontWeight: "bold",
        });

        this.balanceLabel = new Text({ text: "Balance $", style });
        this.balanceValue = new Text({ text: `${this.balance}`, style });

        this.balanceLabel.anchor.set(0.5);
        this.balanceValue.anchor.set(0.5);

        this.balanceLabel.position.set(665, 500);
        this.balanceValue.position.set(665, 530);

        this.betLabel = new Text({ text: "Bet $", style });
        this.betValue = new Text({ text: `${this.bet}`, style });

        this.betLabel.anchor.set(0.5);
        this.betValue.anchor.set(0.5);

        this.betLabel.position.set(128, 493);
        this.betValue.position.set(128, 526);

        this.addChild(
            this.balanceLabel,
            this.balanceValue,
            this.betLabel,
            this.betValue
        );
    }

    private updateHUD(): void {
        const obj = { value: Number(this.balanceValue.text) };

        gsap.to(obj, {
            value: this.balance,
            duration: 0.4,
            onUpdate: () => {
                this.balanceValue.text = Math.floor(obj.value).toString();
            }
        });

        this.betValue.text = `${this.bet}`;
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

            if (symbols.every(s => s === symbols[0])) {
                const multiplier = this.paytable[symbols[0]] || 0;
                totalWin += this.bet * multiplier;

                const winSprites = reels.map((reel, i) =>
                    reel.getVisibleSymbolsSprites()[line[i]]
                );

                animateWinSymbols(winSprites);
            }
        });

        if (totalWin > 0) {
            this.balance += totalWin;
            this.updateHUD();
            this.winText.show(totalWin);
            this.soundManager.play('Win');
        }
    }
}