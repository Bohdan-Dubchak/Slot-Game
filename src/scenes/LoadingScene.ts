import {Container, Graphics, Text, TextStyle} from "pixi.js";

export class LoadingScene extends Container {
    private progressBar: Graphics;
    private progressText: Text;

    constructor() {
        super();

        const width = 800;

        // Текст
        const styleText = new TextStyle({
            fontFamily: "lugio",
            fill: '#ffffff',
            fontSize: 40
        });

        this.progressText = new Text({
            text: "Loading 0%",
            style: styleText
        });

        this.progressText.anchor.set(0.5);
        this.progressText.x = width / 2;
        this.progressText.y = 250;

        // Бар
        this.progressBar = new Graphics();
        this.progressBar.x = 150;
        this.progressBar.y = 300;

        // Додаємо до контейнера
        this.addChild(this.progressText, this.progressBar);
    }

    updateProgress(progress: number) {
        // очищаємо
        this.progressBar.clear();

        // фон
        this.progressBar
            .rect(0, 0, 500, 20)
            .fill(0x333333);

        // прогрес
        this.progressBar
            .rect(0, 0, 500 * progress, 20)
            .fill(0x14bd90);

        this.progressText.text = `Loading ${Math.floor(progress * 100)}%`;
    }
}