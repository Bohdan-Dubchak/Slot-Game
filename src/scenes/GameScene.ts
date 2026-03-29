import { Container, Graphics } from "pixi.js";
import { Reel } from "../reels/Reels.ts";
import { SpinButton } from "../ui/SpinButton.ts";

export class GameScene extends Container {
    private reel!: Reel;

    constructor() {
        super();

        this.createBackground();
        this.createReel();
        this.createUI();
    }

    private createBackground(): void {
        const bg = new Graphics();
        bg.rect(0, 0, 800, 600);
        bg.fill(0x1e1e1e);

        this.addChild(bg);
    }

    private createReel(): void {
        this.reel = new Reel();

        this.reel.position.set(350, 50);

        this.addChild(this.reel);
    }

    private createUI(): void {
        const spinButton = new SpinButton(() => {
            if (this.reel.getIsSpinning()) return;

            this.reel.spin();
        });

        spinButton.position.set(325, 500);

        this.addChild(spinButton);
    }
}