import { Texture } from "pixi.js";
import { BaseInitConfig } from "../../init.config/lib";

export interface CollectAreaInitConfig extends BaseInitConfig {
    texture: Texture,
    catchDistance: number
}