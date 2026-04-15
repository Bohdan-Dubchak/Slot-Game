import { Container,  Sprite, Text, TextStyle, Ticker, Assets} from "pixi.js";
import {gsap } from "gsap";
import { GlowFilter } from "@pixi/filter-glow"
import { ReelsContainer } from "../reels/ReelsContainer";
import { SpinButton } from "../ui/SpinButton";
import { BetButton } from "../ui/BetButton";
import {sound} from "@pixi/sound";

export class GameScene extends Container {
    private reelsContainer!: ReelsContainer;

    private balance: number = 100000;
    private bet: number = 5;

    private balanceLabel!: Text;
    private balanceValue!: Text;

    private betLabel!: Text;
    private betValue!: Text;

    private winText!: Text;

    constructor() {
        super();

        this.init();
    }

    // Завантажує фон та ініціалізує всі елементи сцени
    private async init(): Promise<void> {
        await Assets.load('/assets/Img/BackgroundImage.png');

        this.createBackgroundImage(); //  Фото (задній план)
        this.createBoxBet();             //  box
        this.createBoxBalance();
        this.createReels();           //  Барабани
        this.createUI();              //  Кнопки
        this.createHUD();             //  Текст
    }

    //  Фото задній
    private createBackgroundImage(): void {
        const texture = Assets.get('/assets/Img/BackgroundImage.png');
        const bgSprite = new Sprite(texture);

        bgSprite.width = 800;
        bgSprite.height = 600;
        bgSprite.x = 0;
        bgSprite.y = 0;

        this.addChild(bgSprite);
    }

    // Фото box
    private createBoxBet(): void {
        const texture = Assets.get('/assets/frames/Rectangle.png');
        const bgSprite = new Sprite(texture);

        bgSprite.anchor.set(0.5);
        bgSprite.width = 120;
        bgSprite.height = 28;
        bgSprite.x = 130;
        bgSprite.y = 525;

        this.addChild(bgSprite);
    }

    // Фото Balance
    private createBoxBalance(): void {
        const texture = Assets.get('/assets/frames/Rectangle.png');
        const bgSprite = new Sprite(texture);

        bgSprite.anchor.set(0.5);
        bgSprite.width = 150;
        bgSprite.height = 28;
        bgSprite.x = 660;
        bgSprite.y = 530;

        this.addChild(bgSprite);
    }


    // Анімація пульсації виграшних символів
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
        let interval: any = null;

        // Кнопка збільшення ставки
        const plusButton = new BetButton('/assets/Button/Plus.png', () => {
            this.bet += 5;
            if (this.bet > this.balance) this.bet = this.balance;
            this.updateHUD();
        });

        plusButton.on('pointerdown', () => {
            interval = setInterval(() => {
                this.bet += 5;
                if (this.bet > this.balance) this.bet = this.balance;
                this.updateHUD()
            }, 190)
        })

        const stop = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }

        // Кнопка зменшення ставки
        const minusButton = new BetButton('/assets/Button/Minus.png', () => {
            this.bet -= 5;
            if (this.bet < 5) this.bet = 5;
            this.updateHUD();
        });

        minusButton.on('pointerdown', () => {
            interval = setInterval(() => {
                this.bet -= 5;
                if (this.bet < 5) this.bet = 5;
                this.updateHUD();
            }, 190)
        })
        plusButton.on('pointerup', stop);
        minusButton.on('pointerup', stop);

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

            // СТАРТ ЗВУКУ
            sound.play('Reel', { loop: true });

            this.balance -= this.bet;
            this.updateHUD();

            this.reelsContainer.spinAll(() => {
                // СТОП ЗВУКУ
                this.stopSpinSound();

                this.checkWin();
            });

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

    // функція stop sound
    private stopSpinSound(): void {
        const spinSound = sound.find('Reel');

        if (spinSound) {
            gsap.to(spinSound, {
                volume: 0,
                duration: 0.3,
                onComplete: () => {
                    sound.stop('Reel');
                    spinSound.volume = 1; // повертаємо назад
                }
            })
        }
    }

    // Створює HUD (текстові елементи: баланс, ставка, повідомлення про виграш)
    private createHUD(): void {
        const winStyle = new TextStyle({
            fontFamily: "lugio",
            fontSize: 150,
            fill: "#14bd90",
            fontWeight: "bold",
            align: 'center'
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
            fontFamily: 'lugio',
            fontSize: 25,
            fill: "#ffffff",
            fontWeight: "bold",
            align: 'center'
        });

        this.balanceLabel = new Text({
            text: "Balance $",
            style,
        });

        this.balanceValue = new Text({
            text: `${this.balance}`,
            style,
        });

        this.balanceLabel.anchor.set(0.5);
        this.balanceValue.anchor.set(0.5);

        this.balanceLabel.position.set(665, 500);
        this.balanceValue.position.set(665, 530);

        this.betLabel = new Text({
            text: "\tBet $",
            style,
        });

        this.betValue = new Text({
            text: `${this.bet}`,
            style,
        });

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
            sound.play('Win');
        } else {
            console.log("❌ LOSE");
        }
    }
}