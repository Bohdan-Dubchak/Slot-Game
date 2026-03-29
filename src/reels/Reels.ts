import {Container, Graphics, Ticker} from "pixi.js";

export class Reel extends Container {
    private symbols: Graphics[] = [];
    private speed: number = 0;

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
        this.speed = 10;
    }

    private update(): void {
        if (this.speed <= 0) return;

        for (const symbol of this.symbols) {
            symbol.y += this.speed;

            // Якщо вийшло за низ то переносимо наверх
            if (symbol.y > 600) {
                symbol.y = -100
            }
        }
    }
}