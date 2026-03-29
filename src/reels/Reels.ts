import {Container, Graphics, Ticker} from "pixi.js";

export class Reel extends Container {
    private symbols: Graphics[] = [];
    private speed: number = 0;
    private isSpinning: boolean = false;
    private targetSpeed: number = 0;

    constructor() {
        super();

        this.createSymbols();

        Ticker.shared.add(this.update, this);
    }

    private createSymbols(): void {
        for (let i = 0; i < 5; i++) {
            const symbol = new Graphics();

            symbol.rect(0,0,100,100);
            symbol.fill(0xffffff * Math.random());

            symbol.y = i * 110;

            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    public spin(): void {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.speed = 10; // початкове прискорення
        this.targetSpeed = 10; // максимальна швидкість
    }

    public stop(): void {
        this.targetSpeed = 0; // плавне гальмування
    }

    private update(): void {
        // плавне прискорення / гальмування
        if (this.speed < this.targetSpeed) {
            this.speed += 0.5;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 0.5;
        }

        if (this.speed === 0 && this.targetSpeed === 0) {
            this.isSpinning = false;
        }

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            // Якщо вийшло за низ то переносимо наверх
            if (symbol.y > 600) {
                symbol.y = -100
            }
        }
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }
}