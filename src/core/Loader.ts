import {Assets} from "pixi.js";

export class Loader {
    public static async load(): Promise<void> {
        await Assets.load([
            '/assets/symbols/cherry.png',
            '/assets/symbols/lemon.png',
            '/assets/symbols/seven.png',
            '/assets/symbols/bar.png',
        ]);
    }
}