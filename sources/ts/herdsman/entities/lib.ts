import { Vector2 } from "../../math";
import * as PIXI from "pixi.js";

export interface EntityInitConfig {
    speed: number;
    initPosition: Vector2;
    texture: PIXI.Texture;
    autoBorn: boolean;
    cost?: number;
}

export interface PlayerInitConfig extends EntityInitConfig {
    catchDistance: number,
    followPositionOffset?: Vector2,
    maxFollowers?: number;
}

export interface AnimalInitConfig extends EntityInitConfig {
    catchedTexture: PIXI.Texture,
}

export type CommonEntityConfig = EntityInitConfig | PlayerInitConfig | AnimalInitConfig;