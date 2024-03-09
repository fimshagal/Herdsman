import {
    EntitiesManagerInitConfig,
    EntitiesTypes,
    IEntitiesManagerCollection,
    IEntitiesManagerPoolInitConfig
} from "./lib";
import {
    AnimalInitConfig,
    CommonEntityConfig,
    EntityInitConfig,
    PoisonDemonInitConfig
} from "../../entities/lib";
import {Animal, Entity, PoisonDemon} from "../../entities";
import { MinMax, Vector2 } from "../../../math";
import { Nullable } from "../../../misc";
import * as PIXI from "pixi.js";
import { HerdsmanApp } from "../../core/herdsman.app";
import {getRandomArrayItem} from "../../../misc/get.random.array.item";
import {getRandomXYInRange} from "../../../math/random.xy.in.radius";

export class EntitiesManager {
    private static _singleInstance: EntitiesManager;

    private readonly _view: Nullable<PIXI.Container> = null;

    private _entities: IEntitiesManagerCollection = {
        animals: [],
        poisonDemons: [],
    };

    private _poolInitData: IEntitiesManagerPoolInitConfig = {
        animals: 0,
        poisonDemons: 0,
    };

    private _animalInitConfig: AnimalInitConfig = {} as AnimalInitConfig;
    private _poisonDemonInitConfig: PoisonDemonInitConfig = {} as PoisonDemonInitConfig;

    private _initSpawnPositionRange: MinMax = MinMax.zero;

    private _playerFollowersAmount: number = 0;

    constructor() {
        if (EntitiesManager._singleInstance) {
            throw Error("HerdsmanApp can't be initialised twice");
        }
        this._view = new PIXI.Container();
    }

    public get view(): Nullable<PIXI.Container> {
        return this._view;
    }

    private handleOnEntityDie(entity: Entity): void {
        const appSize = HerdsmanApp.appSize;
        entity.view!.scale.x = 1;
        entity.view!.scale.y = 1;
        entity.setPosition(getRandomXYInRange(new MinMax(appSize.width, appSize.height)));
        entity.born();
        entity.patrol();
    }

    private handleOnEntityFollowPlayer(entity: Entity): void {
        this._playerFollowersAmount += 1;
    }

    private handleOnEntityWasCollected(entity: Entity): void {
        this._playerFollowersAmount -= 1;
    }

    private createAnimalByConfig(config: CommonEntityConfig): Animal {
        const animal: Animal = new Animal();
        animal.init(config);
        this._entities.animals.push(animal as Entity);
        this._view!.addChild(animal.view!);
        return animal;
    }

    private createPoisonDemonByConfig(config: CommonEntityConfig): PoisonDemon {
        const poisonDemon: PoisonDemon = new PoisonDemon();
        poisonDemon.init(config);
        this._entities.poisonDemons.push(poisonDemon as Entity);
        this._view!.addChild(poisonDemon.view!);
        return poisonDemon;
    }

    private listenEntity(entity: Entity): void {
        entity.onDie.add(this.handleOnEntityDie.bind(this));
        entity.onFollowTarget.add(this.handleOnEntityFollowPlayer.bind(this));
        entity.onCollected.add(this.handleOnEntityWasCollected.bind(this));
    }

    private applyInitConfig(initConfig: EntitiesManagerInitConfig): void {
        this._initSpawnPositionRange = initConfig.initSpawnPositionRange;
        this._poolInitData = initConfig.poolInitData;
        this._animalInitConfig = initConfig.animalInitConfig;
        this._poisonDemonInitConfig = initConfig.poisonDemonInitConfig;
    }

    private createAnimalsPool(): void {
        for (let i = 0; i < this._poolInitData.animals; i++) {
            const randomConfig: EntityInitConfig = this.generateRandomInitConfig("animals");
            const animal: Entity = this.createAnimalByConfig(randomConfig);
            this.listenEntity(animal);
        }
    }

    private createPoisonDemonPool() {
        for (let i = 0; i < this._poolInitData.poisonDemons; i++) {
            const randomConfig: EntityInitConfig = this.generateRandomInitConfig("poisonDemons");
            const poisonDemon: Entity = this.createPoisonDemonByConfig(randomConfig);
            this.listenEntity(poisonDemon);
        }
    }

    private generateRandomInitConfig(type: EntitiesTypes): CommonEntityConfig {
        const appSize = HerdsmanApp.appSize;
        const response: CommonEntityConfig = {
            autoBorn: true,
            respawnAble: true,
            initPosition: getRandomXYInRange(new MinMax(appSize.halfWidth, appSize.halfWidth)),
        } as CommonEntityConfig;

        let sourceConfig;

        switch (type) {
            case "animals":
                sourceConfig = this._animalInitConfig;
                response.texture = getRandomArrayItem(sourceConfig.textures!);
                response.textures = sourceConfig.textures;
                response.catchedTexture = sourceConfig.catchedTexture;
                response.cost = sourceConfig.cost;
                response.speed = sourceConfig.speed;
                response.followAble = sourceConfig.followAble;
                response.beholdShift = sourceConfig.beholdShift?.clone().randomiseWithinThreshold(20);
                response.doPatrol = sourceConfig.doPatrol;
                response.patrolDelayRange = sourceConfig.patrolDelayRange;
                response.patrolStepMaxDistance = sourceConfig.patrolStepMaxDistance;
                response.respawnDelayRange = sourceConfig.respawnDelayRange;
                break;
            case "poisonDemons":
                sourceConfig = this._poisonDemonInitConfig;
                response.texture = sourceConfig.texture;
                response.cost = sourceConfig.cost;
                response.speed = sourceConfig.speed;
                response.followAble = sourceConfig.followAble;
                response.beholdShift = sourceConfig.beholdShift?.clone().randomiseWithinThreshold(20);
                response.doPatrol = sourceConfig.doPatrol;
                response.patrolDelayRange = sourceConfig.patrolDelayRange;
                response.patrolStepMaxDistance = sourceConfig.patrolStepMaxDistance;
                response.respawnDelayRange = sourceConfig.respawnDelayRange;
                break;
            default:
                break;
        }

        return response;
    }

    public static getSingle(): EntitiesManager  {
        if (!EntitiesManager._singleInstance) {
            EntitiesManager._singleInstance = new EntitiesManager();
        }
        return EntitiesManager._singleInstance;
    }

    public init(initConfig: EntitiesManagerInitConfig): void {
        this.applyInitConfig(initConfig);
        this.createAnimalsPool();
        this.createPoisonDemonPool();
    }

    public update(deltaTime: number): void {
        EntitiesManager.allEntities
            .forEach((entity: Entity): void => entity.update(deltaTime));
    }

    public static get allEntities(): Entity[] {
        const entities: IEntitiesManagerCollection = EntitiesManager.getSingle()._entities;
        return [
            ...entities.animals,
            ...entities.poisonDemons,
        ];
    }

    public static get animals(): Entity[] {
        return EntitiesManager.getSingle()._entities.animals;
    }

    public static get poisonDemons(): Entity[] {
        return EntitiesManager.getSingle()._entities.poisonDemons;
    }

    public static get playerFollowersAmount(): number {
        return EntitiesManager.getSingle()._playerFollowersAmount;
    }
}