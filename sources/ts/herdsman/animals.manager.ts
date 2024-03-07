import { AnimalsManagerInitConfig, EntityInitConfig } from "./herdsman.interfaces";
import { Animal } from "./animal";
import { MinMax } from "../min.max";
import { Vector2 } from "../vector.2";
import { Texture, Resource } from "pixi.js";
import { Nullable } from "../nullable";
import * as PIXI from "pixi.js";

export class AnimalsManager {
    private static _singleInstance: AnimalsManager;

    private readonly _view: Nullable<PIXI.Container> = null;
    private _poolSize: number = 0;
    private _animals: Animal[] = [];
    private _textures: Texture[] = [];
    private _catchedTexture: Nullable<Texture> = null;
    private _autoSpawnRange: MinMax = new MinMax(0, 0.1);
    private _speed: number = 0;

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
        animal.view!.scale.x = 1;
        animal.view!.scale.y = 1;
        animal.setPosition(this.getRandomCoords(new MinMax(600, 620)));
        animal.born();
        animal.patrol();
    }

    private handleOnAnimalFollowPlayer(animal: Animal): void {
        this._playerFollowersAmount += 1;
    }

    private handleOnAnimalWasCollected(animal: Animal): void {
        this._playerFollowersAmount -= 1;
    }

    private createAnimalByConfig(config: EntityInitConfig): void {
        const animal = new Animal();

        animal.init(config);
        this._animals.push(animal);
        animal.onDie.add(this.handleOnAnimalDie.bind(this));
        animal.onFollowPlayer.add(this.handleOnAnimalFollowPlayer.bind(this));
        animal.onCollected.add(this.handleOnAnimalWasCollected.bind(this));
        this._view!.addChild(animal.view!);
    }

    private getRandomCoords(range: MinMax): Vector2 {
        const theta: number = Math.random() * 2 * Math.PI;
        const distance: number = Math.random() * range.diff + range.min;

        return new Vector2(distance * Math.cos(theta), distance * Math.sin(theta));
    }

    private getRandomTexture(textures: Texture[]): Texture<Resource> {
        return textures[Math.floor(Math.random() * textures.length)];
    }

    private applyInitConfig(initConfig: AnimalsManagerInitConfig): void {
        this._autoSpawnRange = initConfig.autoSpawnRange;
        this._speed = initConfig.speed;
        this._textures = initConfig.textures;
        this._poolSize = initConfig.poolSize;
        this._catchedTexture = initConfig.catchedTexture;
    }

    private createAnimalsPool() {
        for (let i = 0; i < this._poolSize; i++) {
            this.createAnimalByConfig(this.generateRandomAnimalConfig());
        }
    }

    private generateRandomAnimalConfig(): EntityInitConfig {
        return {
            autoBorn: true,
            initPosition: this.getRandomCoords(this._autoSpawnRange),
            texture: this.getRandomTexture(this._textures),
            catchedTexture: this._catchedTexture,
            speed: this._speed,
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

    public static get animals() {
        return AnimalsManager.getSingle()._animals;
    }

    public static get playerFollowersAmount() {
        return AnimalsManager.getSingle()._playerFollowersAmount;
    }
}