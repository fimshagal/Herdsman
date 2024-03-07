import { onDocReady } from "./misc";
import { HerdsmanApp } from "./herdsman";
import { HerdsmanAssets } from "./herdsman/core/herdsman.assets";
import { Vector2, MinMax } from "./math";
import { AnimalsManagerInitConfig } from "./herdsman/managers/animals.manager/lib";
import { CollectAreaInitConfig } from "./herdsman/collect.area/lib";
import { PlayerInitConfig } from "./herdsman/entities/lib";
import * as PIXI from "pixi.js";
import WebFont from "webfontloader";
import { HerdsmanAppConfig } from "./herdsman/core/lib";
import { ScorePointsCounterInitConfig} from "./herdsman/ui/score.points.counter/lib";
import {BackgroundInitConfig} from "./herdsman/background/lib";

(async (): Promise<void> => {

    const animalsTextures: PIXI.Texture[] = [
        HerdsmanAssets.Animal0Texture,
        HerdsmanAssets.Animal1Texture,
        HerdsmanAssets.Animal2Texture,
    ];

    const playerInitConfig: PlayerInitConfig = {
        initPosition: new Vector2(0, -100),
        speed: 0.05,
        texture: HerdsmanAssets.PlayerTexture,
        autoBorn: true,
        catchDistance: 100,
        followPositionOffset: new Vector2(50, 50),
        maxFollowers: 5,
    };

    const animalsManagerInitConfig: AnimalsManagerInitConfig = {
        poolSize: 20,
        speed: 0.05,
        autoSpawnRange: new MinMax(300, 666),
        cost: 2,
        textures: animalsTextures,
        catchedTexture: HerdsmanAssets.AnimalCatchedTexture,
    };

    const collectAreaInitConfig: CollectAreaInitConfig = {
        texture: HerdsmanAssets.CollectAreaTexture,
        initPosition: Vector2.zero,
        catchDistance: 100,
    };

    const backgroundInitConfig: BackgroundInitConfig = {
        texture: HerdsmanAssets.BackgroundTexture,
        initPosition: new Vector2(0, 0),
    };

    const scorePointsCounterInitConfig: ScorePointsCounterInitConfig = {
        styles: {
            dropShadow: false,
            strokeThickness: 8,
            stroke: "#100e36",
            fill: "#ff9900",
            fontWeight: "bold",
            fontSize: 62,
            fontFamily: "Eagle Lake"
        },
        initPosition: new Vector2(335, -350),
        defaultText: "0"
    };

    const herdsmanAppConfig: HerdsmanAppConfig = {
        parentElement: document.querySelector('.application-wrapper'),
        playerInitConfig,
        animalsManagerInitConfig,
        collectAreaInitConfig,
        scorePointsCounterInitConfig,
        backgroundInitConfig,
    };

    const onLoadFont = (): void => HerdsmanApp
        .getSingle()
        .init(herdsmanAppConfig);

    await onDocReady();

    WebFont.load({
        google: { families: ["Eagle Lake"] },
        active: onLoadFont,
    });
})();