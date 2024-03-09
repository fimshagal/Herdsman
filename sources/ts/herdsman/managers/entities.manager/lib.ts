import { MinMax } from "../../../math";
import {AnimalInitConfig, PoisonDemonInitConfig} from "../../entities/lib";
import {Entity} from "../../entities";

export interface EntitiesManagerInitConfig {
    animalInitConfig: AnimalInitConfig;
    poisonDemonInitConfig: PoisonDemonInitConfig;
    poolInitData: IEntitiesManagerPoolInitConfig;
    initSpawnPositionRange: MinMax,
}

export interface IEntitiesManagerCollection {
    [key: string]: Entity[],
}

export interface IEntitiesManagerPoolInitConfig {
    [key: string]: number,
}

export type EntitiesTypes = "animals" | "poisonDemons";