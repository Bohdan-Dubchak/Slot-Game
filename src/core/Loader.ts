import { Assets } from "pixi.js";

export class Loader {
    public static async load(onProgress?: (progress: number) => void): Promise<void> {
        const assets = [
            '/assets/symbols/cherry.png',
            '/assets/symbols/lemon.png',
            '/assets/symbols/seven.png',
            '/assets/symbols/bar.png',
        ];

        let loaded = 0;

        const promises = assets.map(async (asset) => {
            await Assets.load(asset);
            loaded++;

            const progress = loaded / assets.length;
            onProgress?.(progress); // передаємо прогрес
        });

        await Promise.all(promises);
    }
}