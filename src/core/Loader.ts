import { Assets } from "pixi.js";

export class Loader {
    public static async load(onProgress?: (progress: number) => void): Promise<void> {
        const assets = [
            '/assets/symbols/cherry.png',
            '/assets/symbols/lemon.png',
            '/assets/symbols/seven.png',
            '/assets/symbols/bar.png',
            '/assets/Button/Spin.png',
            '/assets/Button/Start.png',
            '/assets/Button/Plus.png',
            '/assets/Button/Minus.png',
            '/assets/frames/Rectangle.png',
            '/assets/Img/Reels.png',
            '/assets/soundButton/soundOFF.png',
            '/assets/soundButton/soundON.png',
            '/assets/Button/AutoSpin.png'
        ];

        let loaded = 0;

        for (const asset of assets) {
            try {
                await Assets.load(asset);

                loaded++;

                const progress = loaded / assets.length;

                // додатково робимо fake delay, бо мало файлів і завантаження йде моментально
                await new Promise(r => setTimeout(r, 200));

                onProgress?.(progress);
            } catch (error) {
                console.warn(`Failed to load asset: ${asset}`, error);
            }

        }

    }
}