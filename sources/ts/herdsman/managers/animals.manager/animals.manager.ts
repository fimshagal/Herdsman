import { AnimalsManagerInitConfig } from "./lib";
import {EntityInitConfig} from "../../entities/lib";
import { Animal } from "../../entities";
import { MinMax, Vector2 } from "../../../math";
import { Nullable } from "../../../misc";
import * as PIXI from "pixi.js";
import { HerdsmanApp } from "../../core/herdsman.app";

export class AnimalsManager {
    private static _singleInstance: AnimalsManager;

    private readonly _view: Nullable<PIXI.Container> = null;
    private _poolSize: number = 0;
    private _animals: Animal[] = [];
    private _textures: PIXI.Texture[] = [];
    private _catchedTexture: Nullable<PIXI.Texture> = null;
    private _autoSpawnRange: MinMax = new MinMax(0, 0.1);
    private _speed: number = 0;
    private _cost: number = 0;

    private _playerFollowersAmount: number = 0;

    constructor() {
        if (AnimalsManager._singleInstance) {
            throw Error("HerdsmanApp can't be initialised twice");
        }
        this._view = new PIXI.Container();
    }

    public get view(): Nullable<PIXI.Container> {
        return this._view;
    }

    private handleOnAnimalDie(animal: Animal): void {
        const appSize = HerdsmanApp.appSize;
        animal.view!.scale.x = 1;
        animal.view!.scale.y = 1;
        animal.setPosition(this.getRandomCoords(new MinMax(appSize.width, appSize.height)));
        animal.born();
        animal.patrol();
    }

    private handleOnAnimalFollowPlayer(animal: Animal): void {
        this._playerFollowersAmount += 1;
    }

    private handleOnAnimalWasCollected(animal: Animal): void {
        this._playerFollowersAmount -= 1;
    }

    private createAnimalByConfig(config: EntityInitConfig): Animal {
        const animal: Animal = new Animal();

        animal.init(config);
        this._animals.push(animal);
        this._view!.addChild(animal.view!);
        return animal;
    }

    private followAnimal(animal: Animal): void {
        animal.onDie.add(this.handleOnAnimalDie.bind(this));
        animal.onFollowPlayer.add(this.handleOnAnimalFollowPlayer.bind(this));
        animal.onCollected.add(this.handleOnAnimalWasCollected.bind(this));
    }

    private getRandomCoords(range: MinMax): Vector2 {
        const theta: number = Math.random() * 2 * Math.PI;
        const distance: number = Math.random() * range.diff + range.min;
        return new Vector2(distance * Math.cos(theta), distance * Math.sin(theta));
    }

    private getRandomTexture(textures: PIXI.Texture[]): PIXI.Texture<PIXI.Resource> {
        return textures[Math.floor(Math.random() * textures.length)];
    }

    private applyInitConfig(initConfig: AnimalsManagerInitConfig): void {
        this._autoSpawnRange = initConfig.autoSpawnRange;
        this._speed = initConfig.speed;
        this._textures = initConfig.textures;
        this._poolSize = initConfig.poolSize;
        this._catchedTexture = initConfig.catchedTexture;
        this._cost = initConfig.cost;
    }

    private createAnimalsPool(): void {
        for (let i = 0; i < this._poolSize; i++) {
            const randomConfig: EntityInitConfig = this.generateRandomAnimalConfig();
            const animal: Animal = this.createAnimalByConfig(randomConfig);
            this.followAnimal(animal);
        }
    }

    private generateRandomAnimalConfig(): EntityInitConfig {
        return {
            autoBorn: true,
            initPosition: this.getRandomCoords(this._autoSpawnRange),
            texture: this.getRandomTexture(this._textures),
            catchedTexture: this._catchedTexture,
            speed: this._speed,
            cost: this._cost,
        } as EntityInitConfig;
    }

    public static getSingle(): AnimalsManager  {
        if (!AnimalsManager._singleInstance) {
            AnimalsManager._singleInstance = new AnimalsManager();
        }
        return AnimalsManager._singleInstance;
    }

    public init(initConfig: AnimalsManagerInitConfig): void {
        this.applyInitConfig(initConfig);
        this.createAnimalsPool();
    }

    public update(deltaTime: number): void {
        this._animals
            .forEach((animal: Animal) => animal.update(deltaTime));
    }

    public static get animals(): Animal[] {
        return AnimalsManager.getSingle()._animals;
    }

    public static get playerFollowersAmount(): number {
        return AnimalsManager.getSingle()._playerFollowersAmount;
    }
}