import {Vector2} from "../../math/vector.2";
import {Texture} from "pixi.js";
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

export type CommonEntityConfig = EntityInitConfig | PlayerInitConfig | AnimalInitConfig;