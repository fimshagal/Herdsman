import { Nullable } from "../../misc/nullable";
import { Vector2 } from "../../math/vector.2";
import * as PIXI from "pixi.js";
import { PlayerInitConfig } from "../entities/lib";
import { AnimalsManagerInitConfig } from "../managers/animals.manager/lib";
import { CollectAreaInitConfig } from "../collect.area/lib";

export interface HerdsmanAppConfig {
    parentElement: Nullable<HTMLElement>,
    playerInitConfig: PlayerInitConfig,
    animalsManagerInitConfig: AnimalsManagerInitConfig,
    collectAreaInitConfig: CollectAreaInitConfig
}

export interface IHerdsmanAssets {
    [key: string]: PIXI.Texture,
}

export interface IResizeConfig {
    [key: string]: Vector2,
}