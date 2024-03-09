import { Vector2 } from "../../../math";
import * as PIXI from "pixi.js";

export interface LivesCounterInitConfig {
    initPosition: Vector2,
    texture: PIXI.Texture,
    offset: number;
}