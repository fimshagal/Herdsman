import * as PIXI from "pixi.js";
import { Vector2 } from "../../../math";

export interface ScorePointsCounterInitConfig {
    styles?: Partial<PIXI.ITextStyle> | PIXI.TextStyle,
    initPosition: Vector2,
    defaultText?: string,
}