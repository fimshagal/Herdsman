import { Nullable } from "../../misc";
import { Vector2 } from "../../math";
import * as PIXI from "pixi.js";
import { PlayerInitConfig } from "../entities/lib";
import { EntitiesManagerInitConfig } from "../managers/entities.manager/lib";
import { CollectAreaInitConfig } from "../collect.area/lib";
import { ScorePointsCounterInitConfig } from "../ui/score.points.counter/lib";
import { BackgroundInitConfig } from "../background/lib";
import { LivesCounterInitConfig } from "../ui/lives.counter/lib";

export interface HerdsmanAppConfig {
    parentElement: Nullable<HTMLElement>,
    playerInitConfig: PlayerInitConfig,
    entitiesManagerInitConfig: EntitiesManagerInitConfig,
    collectAreaInitConfig: CollectAreaInitConfig,
    scorePointsCounterInitConfig: ScorePointsCounterInitConfig,
    backgroundInitConfig: BackgroundInitConfig,
    livesCounterInitConfig: LivesCounterInitConfig,
}

export interface IHerdsmanAssets {
    [key: string]: PIXI.Texture,
}

export interface IResizeConfig {
    [key: string]: Vector2,
}
