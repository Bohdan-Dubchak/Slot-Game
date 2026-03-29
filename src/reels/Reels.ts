import {Container, Graphics} from "pixi.js";

export class Reel extends Container {
    private symbols: Graphics[] = [];

    constructor() {
        super();

        this.createSymbols();
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


}