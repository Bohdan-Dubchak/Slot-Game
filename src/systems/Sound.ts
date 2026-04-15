import { sound} from "@pixi/sound";

export const sounds = {
    Win: '/audio/win.mp3',
    Reel: '/audio/reel.mp3',
    Button: "/audio/Button.mp3",
}

export async function loadSounds() {
    for (const [key, url] of Object.entries(sounds)) {
        sound.add(key, {
            url,
            preload: true,
            volume: 1,
        });
    }
}