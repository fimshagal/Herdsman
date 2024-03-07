import { Nullable } from "../nullable";
import {Texture} from "pixi.js";
import {Vector2} from "../vector.2";
import { MinMax } from "../min.max";
import * as PIXI from "pixi.js";

export interface EntityInitConfig {
    speed: number;
    initPosition: Vector2;
    texture: Texture;
    autoBorn: boolean;
}

export interface PlayerInitConfig extends EntityInitConfig {
    catchDistance: number,
}

export interface AnimalInitConfig extends EntityInitConfig {
    catchedTexture: PIXI.Texture,
}

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

export type CommonEntityConfig = EntityInitConfig | PlayerInitConfig | AnimalInitConfig;

export interface IHerdsmanAssets {
    [key: string]: PIXI.Texture,
}

export interface IResizeConfig {
    [key: string]: Vector2,
}