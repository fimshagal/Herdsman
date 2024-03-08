import { MinMax } from "../../../math";
import { Texture } from "pixi.js";

export interface AnimalsManagerInitConfig {
    poolSize: number;
    speed: number;
    cost: number;
    patrolDelayRange: MinMax;
    patrolStepMaxDistance: number;
    autoSpawnRange: MinMax;
    textures: Texture[];
    catchedTexture: Texture;
}