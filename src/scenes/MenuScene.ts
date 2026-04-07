import {Container, Text, TextStyle} from "pixi.js";

export class MenuScene extends Container {
    constructor(startCallback: () => void) {
        super();

        const style = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 100,
            fill: "#14bd90",
        });

        const title = new Text({
            text: "My Game",
            style: style
        });

        title.anchor.set(0.5);
        title.x = 400;
        title.y = 200;

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

        startBtn.eventMode = 'static';
        startBtn.cursor = 'pointer';

        startBtn.on('pointerdown', () => {
            startCallback();
        });

        this.addChild(title, startBtn);
    }
}