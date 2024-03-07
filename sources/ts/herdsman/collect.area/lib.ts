import { Texture } from "pixi.js";
import { Vector2 } from "../../math";

export interface CollectAreaInitConfig {
    texture: Texture,
    initPosition: Vector2,
    catchDistance: number
}