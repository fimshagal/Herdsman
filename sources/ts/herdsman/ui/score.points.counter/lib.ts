import * as PIXI from "pixi.js";
import { Vector2 } from "../../../math";
import {BaseInitConfig} from "../../../init.config/lib";

export interface ScorePointsCounterInitConfig extends BaseInitConfig {
    styles?: Partial<PIXI.ITextStyle> | PIXI.TextStyle,
    defaultText?: string,
}