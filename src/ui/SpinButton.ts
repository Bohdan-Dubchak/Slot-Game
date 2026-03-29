import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class SpinButton extends Container {
    constructor(onClick: () => void) {
        super();

        this.eventMode = "static";
        this.cursor = "pointer";

        const button = new Graphics();
        button.rect(0, 0, 150, 60);
        button.fill(0xff3b3b);

        const btnStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 22,
            fill: '#ffffff',
            fontWeight: 'bold',
        });

        const btnText = new Text({
            text: 'SPIN',
            style: btnStyle,
        });

        btnText.anchor.set(0.5);
        btnText.x = 75;
        btnText.y = 30;

        this.addChild(button, btnText);

        this.on('pointerdown', onClick);
    }
}