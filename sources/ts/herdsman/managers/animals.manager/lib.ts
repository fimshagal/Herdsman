import { MinMax } from "../../../math";
import { Texture } from "pixi.js";

export interface AnimalsManagerInitConfig {
    poolSize: number;
    speed: number;
    cost: number;
    autoSpawnRange: MinMax;
    textures: Texture[];
    catchedTexture: Texture;
}