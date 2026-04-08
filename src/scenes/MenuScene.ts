import {Container, Text, TextStyle} from "pixi.js";

export class MenuScene extends Container {
    constructor(startCallback: () => void) {
        super();

        const style = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 100,
            fill: "rgba(32,32,126,0.53)",
        });

        const title = new Text({
            text: "Game Slot",
            style: style
        });

        title.anchor.set(0.5);
        title.x = 400;
        title.y = 150;

        const styleBtn = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 60,
            fill: "#ffffff",
        });

        const startBtn = new Text({
            text: "Start",
            style: styleBtn,
        });

        startBtn.anchor.set(0.5);
        startBtn.x = 400;
        startBtn.y = 400;

        startBtn.cursor = 'pointer';

        startBtn.on('pointerdown', () => {
            startCallback();
        });

        setTimeout(() => {
            startBtn.alpha = 1;
            startBtn.eventMode = 'static';
        }, 300)

        this.addChild(title, startBtn);
    }
}