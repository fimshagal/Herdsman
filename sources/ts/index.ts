import { onDocReady } from "./misc";
import { HerdsmanApp } from "./herdsman";
import { HerdsmanAssets } from "./herdsman/core/herdsman.assets";
import { Vector2, MinMax } from "./math";
import { EntitiesManagerInitConfig } from "./herdsman/managers/entities.manager/lib";
import { CollectAreaInitConfig } from "./herdsman/collect.area/lib";
import { PlayerInitConfig } from "./herdsman/entities/lib";
import * as PIXI from "pixi.js";
import WebFont from "webfontloader";
import { HerdsmanAppConfig } from "./herdsman/core/lib";
import { ScorePointsCounterInitConfig} from "./herdsman/ui/score.points.counter/lib";
import {BackgroundInitConfig} from "./herdsman/background/lib";
import { LivesCounterInitConfig } from "./herdsman/ui/lives.counter/lib";
import {LoseScreenInitConfig} from "./herdsman/ui/lose.screen/lib";
import {HurtScreenInitConfig} from "./herdsman/ui/hurt.screen/lib";

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
        doPatrol: false,
        respawnAble: false,
        followAble: false,
    };

    const entitiesManagerInitConfig: EntitiesManagerInitConfig = {
        poolInitData: {
            animals: 15,
            poisonDemons: 3,
        },
        animalInitConfig: {
            speed: 0.05,
            autoBorn: true,
            initPosition: Vector2.zero,
            texture: HerdsmanAssets.Animal0Texture,
            textures: animalsTextures,
            cost: 2,
            beholdShift: new Vector2(10, 20),
            catchedTexture: HerdsmanAssets.AnimalCatchedTexture,
            followAble: true,
            doPatrol: true,
            patrolDelayRange: new MinMax(1e3, 5e3),
            patrolStepMaxDistance: 100,
            respawnAble: true,
            respawnDelayRange: new MinMax(2e3, 3e3),
        },
        poisonDemonInitConfig: {
            speed: 0.075,
            autoBorn: true,
            initPosition: Vector2.zero,
            texture: HerdsmanAssets.PoisonDemonTexture,
            cost: 0,
            beholdShift: new Vector2(10, 20),
            followAble: true,
            doPatrol: true,
            catchedTexture: HerdsmanAssets.PoisonDemonCatchedTexture,
            patrolDelayRange: new MinMax(250, 750),
            patrolStepMaxDistance: 200,
            respawnAble: true,
            respawnDelayRange: new MinMax(1e4, 12e3),
        }
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

    const livesCounterInitConfig: LivesCounterInitConfig = {
        initPosition:  new Vector2(-335, -350),
        texture: HerdsmanAssets.HeartTexture,
        offset: 75,
    };

    const loseScreenInitConfig: LoseScreenInitConfig = {
        initPosition: Vector2.zero,
        restartButtonInitConfig: {
            initPosition: new Vector2(0, 190),
            texture: HerdsmanAssets.ButtonRestartTexture,
            hoverTexture: HerdsmanAssets.ButtonRestartHoverTexture,
        },
    };

    const hurtScreenInitConfig: HurtScreenInitConfig = {
        initPosition: Vector2.zero,
    };

    const herdsmanAppConfig: HerdsmanAppConfig = {
        parentElement: document.querySelector('.application-wrapper'),
        playerInitConfig,
        entitiesManagerInitConfig,
        collectAreaInitConfig,
        scorePointsCounterInitConfig,
        backgroundInitConfig,
        livesCounterInitConfig,
        loseScreenInitConfig,
        hurtScreenInitConfig,
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