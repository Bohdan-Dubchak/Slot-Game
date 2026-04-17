import { Text, TextStyle, Ticker } from "pixi.js";

export class WinTextAnimation extends Text {
    private animationTicker: Ticker | null = null;
    private hideTimeout: any;

    constructor() {
        const style = new TextStyle({
            fontFamily: "lugio",
            fontSize: 150,
            fill: "#14bd90",
            fontWeight: "bold",
            align: 'center'
        });

        super({
            text: "",
            style: style,
        });

        this.anchor.set(0.5);
        this.visible = false;
    }

    // Показує анімацію виграшу
    show(amount: number): void {
        // Очищаємо попередню анімацію, якщо вона є
        this.cleanup();

        this.text = `WIN +${amount}`;
        this.visible = true;
        this.alpha = 0;
        this.scale.set(0.5);

        let step = 0;
        const duration = 15;

        this.animationTicker = new Ticker();
        this.animationTicker.add(() => {
            step++;

            this.alpha = Math.min(1, step / duration);
            const scale = 0.5 + (step / duration) * 0.5;
            this.scale.set(scale);

            if (step >= duration) {
                this.stopAnimation();

                // Ховаємо текст через 1.5 секунди
                this.hideTimeout = setTimeout(() => {
                    this.visible = false;
                }, 1500);
            }
        });

        this.animationTicker.start();
    }

    // Зупиняє поточну анімацію
    private stopAnimation(): void {
        if (this.animationTicker) {
            this.animationTicker.stop();
            this.animationTicker.destroy();
            this.animationTicker = null;
        }
    }

    // Очищає всі таймери та анімації
    private cleanup(): void {
        this.stopAnimation();

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    // Викликається при знищенні об'єкта
    destroy(options?: any): void {
        this.cleanup();
        super.destroy(options);
    }
}
