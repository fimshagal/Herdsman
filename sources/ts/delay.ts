import * as TWEEN from "@tweenjs/tween.js";

export const delay = async (ms: number): Promise<void> => {
    return await new Promise((resolve) => {
        new TWEEN.Tween({ x: 1 })
            .to({ x: 0 }, ms)
            .onComplete(() => resolve())
            .start();
    });
};