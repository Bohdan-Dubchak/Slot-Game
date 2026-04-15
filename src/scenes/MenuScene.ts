import { Container, Text, TextStyle } from "pixi.js";
import { StartButton } from "../ui/startButton.ts";
import { gsap } from "gsap";

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
        title.position.set(400, 150);

        const startBtn = new StartButton(startCallback);
        startBtn.position.set(325, 370);

        startBtn.alpha = 0;

        gsap.to(startBtn, {
            alpha: 1,
            duration: 0.5,
            delay: 0.3
        });

        this.addChild(title, startBtn);
    }
}