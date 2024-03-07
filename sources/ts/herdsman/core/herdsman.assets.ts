import PlayerTexture from "../../../textures/player.png";
import BackgroundTexture from "../../../textures/background.jpg";
import CollectAreaTexture from "../../../textures/collect-area.png";
import Animal0Texture from "../../../textures/animal-0.png";
import Animal1Texture from "../../../textures/animal-1.png";
import Animal2Texture from "../../../textures/animal-2.png";
import AnimalCatchedTexture from "../../../textures/animal-catched.png";
import PlayerGlowTexture from "../../../textures/player-glow.png";

import * as PIXI from "PIXI.js";

import { IHerdsmanAssets } from "./lib";

export const HerdsmanAssets: IHerdsmanAssets = {
    PlayerTexture: PIXI.Texture.from(PlayerTexture),
    BackgroundTexture: PIXI.Texture.from(BackgroundTexture),
    Animal0Texture: PIXI.Texture.from(Animal0Texture),
    Animal1Texture: PIXI.Texture.from(Animal1Texture),
    Animal2Texture: PIXI.Texture.from(Animal2Texture),
    CollectAreaTexture: PIXI.Texture.from(CollectAreaTexture),
    AnimalCatchedTexture: PIXI.Texture.from(AnimalCatchedTexture),
    PlayerGlowTexture: PIXI.Texture.from(PlayerGlowTexture)
};