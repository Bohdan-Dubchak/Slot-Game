import { Container, Ticker, Sprite, Assets, Texture, Graphics } from "pixi.js";

type SymbolData = {
    id: string;
    texture: Texture;
};

export class Reel extends Container {
    private symbols: Sprite[] = [];
    private symbolsContainer: Container;

    private symbolSize = 110;
    private reelHeight = 330;

    private speed = 0;
    private targetSpeed = 0;
    private isSpinning = false;

    private symbolMap: SymbolData[] = [];

    constructor() {
        super();

        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);

        this.createMask();
        this.loadTextures();
        this.createSymbols();

        Ticker.shared.add(this.update, this);
    }

    private createMask(): void {
        const mask = new Graphics();
        mask.rect(0, 0, this.symbolSize, this.reelHeight);
        mask.fill(0xffffff);

        this.addChild(mask);
        this.symbolsContainer.mask = mask;
    }

    private loadTextures(): void {
        this.symbolMap = [
            { id: "cherry", texture: Assets.get("/assets/symbols/cherry.png") },
            { id: "lemon", texture: Assets.get("/assets/symbols/lemon.png") },
            { id: "seven", texture: Assets.get("/assets/symbols/seven.png") },
            { id: "bar", texture: Assets.get("/assets/symbols/bar.png") }
        ];
    }

    private getRandomSymbol(): SymbolData {
        const index = Math.floor(Math.random() * this.symbolMap.length);
        return this.symbolMap[index];
    }

    private createSymbols(): void {
        for (let i = 0; i < 5; i++) {
            const { id, texture } = this.getRandomSymbol();

            const sprite = new Sprite(texture);

            sprite.width = this.symbolSize;
            sprite.height = this.symbolSize;
            sprite.y = i * this.symbolSize;

            (sprite as any).symbolId = id;

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
        if (this.speed < this.targetSpeed) {
            this.speed += 0.5;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 0.5;
        }

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            if (symbol.y >= this.symbolSize * this.symbols.length) {
                symbol.y -= this.symbolSize * this.symbols.length;

                const { id, texture } = this.getRandomSymbol();
                symbol.texture = texture;
                (symbol as any).symbolId = id;
            }
        }

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

    public getMiddleSymbol(): string {
        const targetY = this.symbolSize;

        let closest = this.symbols[0];
        let minDiff = Infinity;

        for (const symbol of this.symbols) {
            const diff = Math.abs(symbol.y - targetY);

            if (diff < minDiff) {
                minDiff = diff;
                closest = symbol;
            }
        }

        return (closest as any).symbolId;
    }

    public getVisibleSymbols(): string[] {
        const result: string[] = [];

        for (let row = 0; row < 3; row++) {
            const targetY = row * this.symbolSize;


            let closest = this.symbols[0];
            let minDiff = Infinity;

            for (const symbol of this.symbols) {
                const diff = Math.abs(symbol.y - targetY);

                if (diff < minDiff) {
                    minDiff = diff;
                    closest = symbol;
                }
            }

            result.push((closest as any).symbolId);
        }
        return result;
    }
}