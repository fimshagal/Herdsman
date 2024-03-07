import { Texture } from "pixi.js";
import { Vector2 } from "../../math/vector.2";

export interface CollectAreaInitConfig {
    texture: Texture,
    initPosition: Vector2,
    catchDistance: number
}