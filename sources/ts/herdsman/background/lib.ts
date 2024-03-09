import * as PIXI from "pixi.js";
import { BaseInitConfig } from "../../init.config/lib";

export interface BackgroundInitConfig extends BaseInitConfig {
    texture: PIXI.Texture,
}