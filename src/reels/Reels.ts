import {Container, Ticker, Sprite, Assets, Texture} from "pixi.js";

export class Reel extends Container {
    private symbols: Sprite[] = [];
    private textures: Texture[] = [];
    private speed: number = 0;
    private isSpinning: boolean = false;
    private targetSpeed: number = 0;

    constructor() {
        super();

        this.loadTextures();
        this.createSymbols();

        Ticker.shared.add(this.update, this);
    }

    private loadTextures(): void {
        this.textures = [
            Assets.get('/assets/symbols/cherry.png'),
            Assets.get('/assets/symbols/lemon.png'),
            Assets.get('/assets/symbols/seven.png'),
            Assets.get('/assets/symbols/bar.png'),
        ];
    }

    private getRandomTexture(): Texture {
        const index = Math.floor(Math.random() * this.textures.length);
        return this.textures[index]
    }

    private createSymbols(): void {
        for (let i = 0; i < 5; i++) {
            const sprite = new Sprite(this.getRandomTexture());

            sprite.width = 100;
            sprite.height = 100;

            sprite.y = i * 110;

            this.symbols.push(sprite);
            this.addChild(sprite);
        }
    }

    public spin(): void {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.speed = 0; // початкове прискорення
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

                // новий символ при прокрутці
                symbol.texture = this.getRandomTexture();
            }
        }
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }
}