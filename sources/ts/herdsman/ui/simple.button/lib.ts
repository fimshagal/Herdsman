import { BaseInitConfig } from "../../../init.config/lib";
import * as PIXI from "pixi.js";

export interface SimpleButtonInitConfig extends BaseInitConfig {
    texture: PIXI.Texture;
    hoverTexture?: PIXI.Texture
}