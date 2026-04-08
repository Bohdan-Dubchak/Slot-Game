import {Container, Graphics, Text, TextStyle} from "pixi.js";

export class LoadingScene extends Container {
    private progressBar: Graphics;
    private progressText: Text;

    private displayedProgress: number = 0;
    private isLoaded: boolean = false;

    constructor() {
        super();

        const width = 800;

        // Текст
        const styleText = new TextStyle({
            fontFamily: "lugio",
            fill: '#7fbc6e',
            fontSize: 40
        });

        this.progressText = new Text({
            text: "Loading 0%",
            style: styleText
        });

        this.progressText.anchor.set(0.5);
        this.progressText.x = width / 2;
        this.progressText.y = 300;

        // Бар
        this.progressBar = new Graphics();
        this.progressBar.x = 150;
        this.progressBar.y = 300;

        // Додаємо до контейнера
        this.addChild(this.progressText);
    }

    updateProgress(progress: number) {
        if (progress >= 1) {
            this.displayedProgress = 1;
        } else {
            this.displayedProgress += (progress - this.displayedProgress) * 0.1;
        }

        this.progressBar.clear();

        const percent = Math.floor(this.displayedProgress * 100);

        if (percent >= 100 && !this.isLoaded) {
            setTimeout(() => {
            this.progressText.text = `Loading ${percent}%`;
            this.isLoaded = true;

            }, 2000)
        } else {
            this.progressText.text = `Loading ${percent}%`;
        }
    }
}