import { sound } from "@pixi/sound";

export class SoundManager {
    private muted: boolean = false;

    toggleMuted(): void {
        this.muted = !this.muted;

        if (this.muted) {
            sound.muteAll();
        } else {
            sound.unmuteAll();
        }
    }

    play(name: string, options?: any): void {
        if (this.muted) return;
        sound.play(name, options);
    }

    stop(name: string): void {
        sound.stop(name);
    }
}