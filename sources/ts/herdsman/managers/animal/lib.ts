import { MinMax } from "../../../math/min.max";
import { Texture } from "pixi.js";

export interface AnimalsManagerInitConfig {
    poolSize: number;
    speed: number;
    autoSpawnRange: MinMax;
    textures: Texture[];
    catchedTexture: Texture;
}