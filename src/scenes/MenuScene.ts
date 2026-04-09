import {Container, Text, TextStyle} from "pixi.js";
import {StartButton} from "../ui/startButton.ts";

export class MenuScene extends Container {
    constructor(startCallback: () => void) {
        super();

        const style = new TextStyle({
            fontFamily: 'lugio',
            fontSize: 100,
            fill: "rgba(21,21,228,0.53)",
        });

        const title = new Text({
            text: "Game Slot",
            style: style
        });

        title.anchor.set(0.5);
        title.x = 400;
        title.y = 150;

        // Створюємо кнопку з колбеком
        const startBtn = new StartButton(startCallback);

        startBtn.x = 325;
        startBtn.y = 370;

        // Анімація появи (опціонально)
        startBtn.alpha = 0;
        setTimeout(() => {
            startBtn.alpha = 1;
        }, 300);

        this.addChild(title, startBtn);
    }
}