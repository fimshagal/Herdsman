import { onDocReady } from "./misc/on.doc.ready";
import { HerdsmanApp } from "./herdsman";
import { HerdsmanAssets } from "./herdsman/core/herdsman.assets";
import { Vector2 } from "./math/vector.2";
import { MinMax } from "./math/min.max";
import {AnimalsManagerInitConfig, CollectAreaInitConfig, PlayerInitConfig} from "./herdsman/core/lib";
import * as PIXI from "pixi.js";

import WebFont from "webfontloader";

(async (): Promise<void> => {

    const animalsTextures: PIXI.Texture[] = [HerdsmanAssets.Animal0Texture, HerdsmanAssets.Animal1Texture, HerdsmanAssets.Animal2Texture];

    const playerInitConfig: PlayerInitConfig = {
        initPosition: new Vector2(0, -100),
        speed: 0.05,
        texture: HerdsmanAssets.PlayerTexture,
        autoBorn: true,
        catchDistance: 100,
    };

    const animalsManagerInitConfig: AnimalsManagerInitConfig = {
        poolSize: 20,
        speed: 0.05,
        autoSpawnRange: new MinMax(300, 666),
        textures: animalsTextures,
        catchedTexture: HerdsmanAssets.AnimalCatchedTexture,
    };

    const collectAreaInitConfig: CollectAreaInitConfig = {
        texture: HerdsmanAssets.CollectAreaTexture,
        initPosition: Vector2.zero,
        catchDistance: 100,
    };

    const onLoadFont = () => {
        HerdsmanApp
            .getSingle()
            .init({
                parentElement: document.querySelector('.application-wrapper'),
                playerInitConfig,
                animalsManagerInitConfig,
                collectAreaInitConfig
            });
    };

    await onDocReady();

    WebFont.load({
        google: {
            families: ["Eagle Lake"]
        },
        active: onLoadFont,
    });
})();