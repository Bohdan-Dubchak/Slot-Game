import { Sprite, Texture, Assets } from "pixi.js";


export class SoundToggleButton extends Sprite {
    private isMuted: boolean = false;
    private textures: {
        on: Texture;
        off: Texture;
    };

    constructor() {
        const textureOff = Assets.get('/assets/soundButton/soundOFF.png');
        const textureOn = Assets.get('/assets/soundButton/soundON.png');

        super(textureOn);

        this.textures = {
            off: textureOff,
            on: textureOn
        };

        this.setupInteraction();
    }

    private setupInteraction(): void {
        this.anchor.set(0.5);
        this.interactive = true;
        this.cursor = "pointer";

        this.on('pointerdown', this.toggle);

    }

    private toggle(): void {
        this.isMuted = !this.isMuted;
        this.texture = this.isMuted ? this.textures.off : this.textures.on;

        // Emit custom event замість callback
        this.emit('soundToggle');
    }

    public setMuted(muted: boolean): void {
        if (this.isMuted !== muted) {
            this.isMuted = muted;
            this.texture = this.isMuted ? this.textures.off : this.textures.on;
        }
    }

    public getMuted(): boolean {
        return this.isMuted;
    }
}