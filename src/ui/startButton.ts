import {Container, Graphics, TextStyle, Text} from "pixi.js";

export class StartButton extends Container {
    constructor(onClick: () => void) {
        super();

        const button = new Graphics();
        button.rect(0, 0, 150, 60);
        button.fill(0xff3b3b);

        const style = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 30,
            fill: "#ffffff",
            fontWeight: 'bold',
        });

        const startBtn = new Text({
            text: "Start",
            style: style,
        });

        startBtn.anchor.set(0.5);
        startBtn.x = 75;
        startBtn.y = 30;

        this.addChild(button);
        this.addChild(startBtn);

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on('pointerdown', onClick);

        button.on('pointerover', () => {
            button.scale.set(1.05);
        })
        button.on('pointerout', () => {
            button.scale.set(1);
        })
    }
}
