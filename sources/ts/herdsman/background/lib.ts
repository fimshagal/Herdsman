import * as PIXI from "pixi.js";
import { Vector2 } from "../../math";

export interface BackgroundInitConfig {
    texture: PIXI.Texture,
    initPosition: Vector2,
}