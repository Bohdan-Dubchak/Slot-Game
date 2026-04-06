import { Container,  Sprite, Text, TextStyle, Ticker, Assets} from "pixi.js";
import {gsap } from "gsap";
import {GlowFilter } from "@pixi/filter-glow"
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


    constructor() {
        super();

        this.init();
    }

    // Завантажує фон та ініціалізує всі елементи сцени
    private async init(): Promise<void> {
        await Assets.load('/assets/Fon/BackgroundImage.png');

        this.createBackgroundImage(); //  Фото (задній план)
        this.createReels();           //  Барабани
        this.createUI();              //  Кнопки
        this.createHUD();             //  Текст
    }

    //  Фото задній
    private createBackgroundImage(): void {
        const texture = Assets.get('/assets/Fon/BackgroundImage.png');
        const bgSprite = new Sprite(texture);

        bgSprite.width = 800;
        bgSprite.height = 600;
        bgSprite.x = 0;
        bgSprite.y = 0;

        this.addChild(bgSprite);
    }

    // Анімація пульсації виграшних символів
    // @ts-ignore
    private animateWinSymbols(symbols: Sprite[]): void {
        symbols.forEach((sprite) => {
            const originalScale = sprite.scale.x;
            let step = 0;
            const duration = 15;

            const ticker = new Ticker();
            ticker.add(() => {
                step++;
                const progress = step / duration;

                // Пульсація: збільшення -> повернення
                const scale = originalScale * (1 + Math.sin(progress * Math.PI) * 0.3);
                sprite.scale.set(scale);

                if (step >= duration) {
                    ticker.stop();
                    ticker.destroy();
                    sprite.scale.set(originalScale);
                }
            });
            ticker.start();
        });
    }

    // Виділяє виграшні символи зеленим світінням (Glow) з анімацією пульсації  !!! --не працює--
    // @ts-ignore
    private highlightWinSymbols(symbols: Sprite[]): void {
    symbols.forEach(sprite => {
        // Створюємо Glow фільтр один раз
        const glow = new GlowFilter({
            distance: 15,
            outerStrength: 4,
            innerStrength: 0,
            color: 0x33ff55,
            quality: 0.5,
        });
        glow.padding = 20;
        sprite.filters = [glow as any];

        // Анімація пульсації outerStrength через Tween
        gsap.to(glow, {
            outerStrength: 6,       // максимальна сила світіння
            duration: 0.3,          // тривалість одного циклу
            yoyo: true,             // назад
            repeat: 5,              // кількість пульсацій
            ease: "sine.inOut",     // плавна функція easing
            onComplete: () => {
                sprite.filters = null; // прибираємо Glow після анімації
            }
        });
    });
}

    // Створює об’єкт ReelsContainer та додає його у сцену
    private createReels(): void {
        this.reelsContainer = new ReelsContainer(3);
        this.reelsContainer.position.set(200, 50);

        this.addChild(this.reelsContainer);
    }

    // Створює UI кнопки: ставка плюс/мінус та спін
    private createUI(): void {
        // Кнопка збільшення ставки
        const plusButton = new BetButton("+", () => {
            this.bet += 5;
            if (this.bet > this.balance) this.bet = this.balance;
            this.updateHUD();
        });

        // Кнопка зменшення ставки
        const minusButton = new BetButton("-", () => {
            this.bet -= 5;
            if (this.bet < 5) this.bet = 5;
            this.updateHUD();
        });

        plusButton.position.set(200, 500);
        minusButton.position.set(20, 500);

        this.addChild(plusButton, minusButton);

        // Кнопка спіну
        const spinButton = new SpinButton(() => {
            if (this.reelsContainer.isAnySpinning()) return;

            if (this.balance < this.bet) {
                console.log("❌ Not enough balance");
                return;
            }

            // Віднімаємо ставку з балансу
            this.balance -= this.bet;
            this.updateHUD();

            // Запускаємо спін усіх барабанів
            this.reelsContainer.spinAll(() => {
                this.checkWin(); // Перевіряємо виграш після зупинки
            });
        });

        spinButton.position.set(325, 500);
        this.addChild(spinButton);
    }

    // Створює HUD (текстові елементи: баланс, ставка, повідомлення про виграш)
    private createHUD(): void {
        const winStyle = new TextStyle({
            fontSize: 100,
            fill: "#15448a",
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

    // Показує анімацію виграшу на екрані
    private showWin(amount: number): void {
        this.winText.text = `WIN +${amount}`;
        this.winText.visible = true;
        this.winText.alpha = 0;
        this.winText.scale.set(0.5);

        let step = 0;
        const duration = 15;

        const ticker = new Ticker();
        ticker.add(() => {
            step++;

            this.winText.alpha = Math.min(1, step / duration);
            const scale = 0.5 + (step / duration) * 0.5;
            this.winText.scale.set(scale);

            if (step >= duration) {
                ticker.stop();
                ticker.destroy();

                setTimeout(() => {
                    this.winText.visible = false;
                }, 1500);
            }
        });
        ticker.start();
    }

    // Оновлює HUD (баланс і ставка)
    private updateHUD(): void {
        this.balanceText.text = `Balance: ${this.balance}`;
        this.betText.text = `Bet: ${this.bet}`;
    }

    // Таблиця виплат (paytable) для символів
    private paytable: Record<string, number> = {
        cherry: 2,
        lemon: 3,
        bar: 5,
        seven: 10,
    };

    // Перевіряє виграш по лініях, виділяє та анімує виграшні символи, оновлює баланс
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
                const symbol = symbols[0];
                const multiplier = this.paytable[symbol] || 0;

                const win = this.bet * multiplier;
                totalWin += win;

                const winSprites = reels.map((reel, i) =>
                    reel.getVisibleSymbolsSprites()[line[i]]
                );

                // this.highlightWinSymbols(winSprites);
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
}