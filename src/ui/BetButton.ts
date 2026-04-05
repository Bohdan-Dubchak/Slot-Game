import {Container, Text, TextStyle, Graphics } from "pixi.js";

export class BetButton extends Container{
    constructor(label: string, onClick: () => void) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const button = new Graphics();
        button.rect(0,0,50,50);
        button.fill(0x4caf50); // зелений для +/-

        const style = new TextStyle({
            fontSize: 24,
            fill: '#ffffff',
            fontWeight: 'bold',
        });

        const text = new Text({
            text: label,
            style
        });
        text.anchor.set(0.5);
        text.x = 25;
        text.y = 25;

        this.addChild(button, text);

        this.on('pointerdown', onClick);

    }


}