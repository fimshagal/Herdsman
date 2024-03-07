import { Nullable } from "../misc/nullable";
import {Texture} from "pixi.js";
import {Vector2} from "../math/vector.2";
import { MinMax } from "../math/min.max";
import * as PIXI from "pixi.js";
import { PlayerInitConfig } from "./entities/lib";

export interface AnimalsManagerInitConfig {
    poolSize: number;
    speed: number;
    autoSpawnRange: MinMax;
    textures: Texture[];
    catchedTexture: Texture;
}

export interface HerdsmanAppConfig {
    parentElement: Nullable<HTMLElement>,
    playerInitConfig: PlayerInitConfig,
    animalsManagerInitConfig: AnimalsManagerInitConfig,
    collectAreaInitConfig: CollectAreaInitConfig
}

export interface CollectAreaInitConfig {
    texture: Texture,
    initPosition: Vector2,
    catchDistance: number
}

export interface IHerdsmanAssets {
    [key: string]: PIXI.Texture,
}

export interface IResizeConfig {
    [key: string]: Vector2,
}