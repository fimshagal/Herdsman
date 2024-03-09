import {MinMax, Vector2} from "../../math";
import * as PIXI from "pixi.js";
import {Nullable} from "../../misc";
import {BaseInitConfig} from "../../init.config/lib";

export interface EntityInitConfig extends BaseInitConfig {
    speed: number;
    texture: PIXI.Texture;
    textures?: PIXI.Texture[],
    followAble: boolean;
    doPatrol: boolean;
    respawnAble: boolean;
    autoBorn: boolean;
    cost?: number;
    respawnDelayRange?: MinMax;
    patrolDelayRange?: MinMax;
    patrolStepMaxDistance?: number;
    catchedTexture?: Nullable<PIXI.Texture>;
    beholdShift?: Vector2,
}

export interface PlayerInitConfig extends EntityInitConfig {
    catchDistance: number,
    followPositionOffset?: Vector2,
    maxFollowers?: number;
}

export interface AnimalInitConfig extends EntityInitConfig {
}

export interface PoisonDemonInitConfig extends EntityInitConfig {
}

export type CommonEntityConfig = EntityInitConfig | PlayerInitConfig | AnimalInitConfig | PoisonDemonInitConfig;