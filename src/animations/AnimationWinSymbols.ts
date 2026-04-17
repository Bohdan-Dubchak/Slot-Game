import { Sprite } from 'pixi.js';
import { gsap } from 'gsap';
import { GlowFilter } from "@pixi/filter-glow"

export function animateWinSymbols(symbols: Sprite[]): void {
    symbols.forEach((sprite) => {
        gsap.killTweensOf(sprite.scale);

        const original = sprite.scale.x;

        gsap.to(sprite.scale, {
            x: original * 1.1,
            y: original * 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 3,
            ease: "sine.inOut"
        });
    });
}

// Виділяє виграшні символи зеленим світінням (Glow) з анімацією пульсації  !!! --не працює--
// @ts-ignore
export function highlightWinSymbols(symbols: Sprite[]): void {
    symbols.forEach(sprite => {
        // Створюємо Glow фільтр один раз
        const glow = new GlowFilter({
            distance: 15,
            outerStrength: 4,
            innerStrength: 0,
            color: 0x33ff55,
            quality: 0.5,
        });
        glow.padding = 20;
        sprite.filters = [glow as any];

        // Анімація пульсації outerStrength через Tween
        gsap.to(glow, {
            outerStrength: 6,       // максимальна сила світіння
            duration: 0.3,          // тривалість одного циклу
            yoyo: true,             // назад
            repeat: 5,              // кількість пульсацій
            ease: "sine.inOut",     // плавна функція easing
            onComplete: () => {
                sprite.filters = null; // прибираємо Glow після анімації
            }
        });
    });
}