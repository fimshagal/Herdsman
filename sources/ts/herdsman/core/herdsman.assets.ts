import PlayerTexture from "../../../textures/player.png";
import BackgroundTexture from "../../../textures/background.jpg";
import CollectAreaTexture from "../../../textures/collect-area.png";
import Animal0Texture from "../../../textures/animal-0.png";
import Animal1Texture from "../../../textures/animal-1.png";
import Animal2Texture from "../../../textures/animal-2.png";
import PoisonDemonTexture from "../../../textures/poison-demon.png";
import PoisonDemonCatchedTexture from "../../../textures/poison-demon-catched.png";
import AnimalCatchedTexture from "../../../textures/animal-catched.png";
import PlayerGlowTexture from "../../../textures/player-glow.png";
import HeartTexture from "../../../textures/heart.png";
import LoseBackgroundTexture from "../../../textures/lose-background.jpg";
import HurtBackgroundTexture from "../../../textures/damage-overlay.png";
import ButtonRestartTexture from "../../../textures/button-restart.png";
import ButtonRestartHoverTexture from "../../../textures/button-restart-hover.png";
import * as PIXI from "PIXI.js";
import { IHerdsmanAssets } from "./lib";

const createTexture = (uri: string): PIXI.Texture => PIXI.Texture.from(uri);

export const HerdsmanAssets: IHerdsmanAssets = {
    PlayerTexture: createTexture(PlayerTexture),
    BackgroundTexture: createTexture(BackgroundTexture),
    Animal0Texture: createTexture(Animal0Texture),
    Animal1Texture: createTexture(Animal1Texture),
    Animal2Texture: createTexture(Animal2Texture),
    CollectAreaTexture: createTexture(CollectAreaTexture),
    AnimalCatchedTexture: createTexture(AnimalCatchedTexture),
    PlayerGlowTexture: createTexture(PlayerGlowTexture),
    PoisonDemonTexture: createTexture(PoisonDemonTexture),
    PoisonDemonCatchedTexture: createTexture(PoisonDemonCatchedTexture),
    HeartTexture: createTexture(HeartTexture),
    LoseBackgroundTexture: createTexture(LoseBackgroundTexture),
    HurtBackgroundTexture: createTexture(HurtBackgroundTexture),
    ButtonRestartTexture: createTexture(ButtonRestartTexture),
    ButtonRestartHoverTexture: createTexture(ButtonRestartHoverTexture),
};