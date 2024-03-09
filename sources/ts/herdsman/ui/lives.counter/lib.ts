import * as PIXI from "pixi.js";
import {BaseInitConfig} from "../../../init.config/lib";

export interface LivesCounterInitConfig extends BaseInitConfig {
    texture: PIXI.Texture,
    offset: number;
}