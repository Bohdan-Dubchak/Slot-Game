import { Container, Ticker, Sprite, Assets, Texture, Graphics } from "pixi.js";

export class Reel extends Container {
    private symbols: Sprite[] = [];
    private textures: Texture[] = [];

    private symbolSize = 110;
    private reelHeight = 330; // 3 видимі символи
    private speed: number = 0;
    private targetSpeed: number = 0;
    private isSpinning: boolean = false;

    private symbolsContainer: Container;

    constructor() {
        super();

        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);

        this.createMask();
        this.loadTextures();
        this.createSymbols();

        Ticker.shared.add(this.update, this);
    }

    // (вікно барабана)
    private createMask(): void {
        const mask = new Graphics();
        mask.rect(0, 0, this.symbolSize, this.reelHeight);
        mask.fill(0xffffff);

        this.addChild(mask);
        this.symbolsContainer.mask = mask;
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
        return this.textures[index];
    }

    private createSymbols(): void {
        // робимо 5 символів (щоб було що прокручувати)
        for (let i = 0; i < 5; i++) {
            const sprite = new Sprite(this.getRandomTexture());

            sprite.width = this.symbolSize;
            sprite.height = this.symbolSize;

            sprite.y = i * this.symbolSize;

            this.symbols.push(sprite);
            this.symbolsContainer.addChild(sprite);
        }
    }

    public spin(): void {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.speed = 0;
        this.targetSpeed = 10;
    }

    public stop(): void {
        this.targetSpeed = 0;
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }

    private update(): void {
        // плавне прискорення / гальмування
        if (this.speed < this.targetSpeed) {
            this.speed += 0.5;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 0.5;
        }

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            // якщо вийшов за межі — переносимо наверх
            if (symbol.y >= this.symbolSize * this.symbols.length) {
                symbol.y -= this.symbolSize * this.symbols.length;
                symbol.texture = this.getRandomTexture();
            }
        }

        // SNAP TO GRID
        if (this.targetSpeed === 0 && this.speed < 0.5) {
            this.snapToGrid();
            this.speed = 0;
            this.isSpinning = false;
        }
    }

    private snapToGrid(): void {
        for (const symbol of this.symbols) {
            const remainder = symbol.y % this.symbolSize;

            symbol.y -= remainder;

            if (remainder > this.symbolSize / 2) {
                symbol.y += this.symbolSize;
            }
        }
    }
}