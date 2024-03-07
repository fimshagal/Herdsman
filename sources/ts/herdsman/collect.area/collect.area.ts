import { CollectAreaInitConfig } from "./lib";
import * as PIXI from "pixi.js";
import { Nullable } from "../../misc/nullable";
import { Animal } from "../entities/animal";
import { Vector2 } from "../../math/vector.2";
import { AnimalsManager } from "../managers/animals.manager/animals.manager";
import { StatsManager } from "../managers/stats.manager/stats.manager";

export class CollectArea {
    private _view: Nullable<PIXI.Sprite> = null;
    private _position: Vector2 = Vector2.zero;
    private _catchDistance: number = 0;

    public init(config: CollectAreaInitConfig): void {
        this._view = new PIXI.Sprite(config.texture);
        this._view.anchor.set(0.5, 0.5);

        this._catchDistance = config.catchDistance;

        this.setPosition(config.initPosition.clone());
    }

    public setPosition(vector2: Vector2): void {
        this._position = vector2.clone();
        this._view!.x = this._position.x;
        this._view!.y = this._position.y;
    }

    public get view(): Nullable<PIXI.Sprite> {
        return this._view;
    }

    public update(deltaTime: number): void {
        this.searchAnimals(AnimalsManager.animals);
    }

    private searchAnimals(animals: Animal[]): void {
        const animalsInRadius: Animal[] = this.getAnimalsInRadius(animals);

        if (!animalsInRadius.length) {
            return;
        }

        animalsInRadius.forEach(async (animal: Animal) => {
            await animal.collect(this);
            StatsManager.addAnimals(1);
        });
    }

    private getAnimalsInRadius(animals: Animal[]): Animal[] {
        const response: Animal[] = [];
        for (let i: number = 0; i < animals.length; i++) {
            const animal: Animal = animals[i];
            if(animal.isCollected || !animal.isFollower) {
                continue;
            }
            if (this.checkIsAnimalInCatchDistance(animal)) {
                response.push(animal);
            }
        }
        return response;
    }

    private checkIsAnimalInCatchDistance(animal: Animal): boolean {
        return Vector2.distance(animal.position, this.position) <= this._catchDistance;
    }

    public get position(): Vector2 {
        return this._position;
    }

    public get collectPosition(): Vector2 {
        return this._position.clone().add(new Vector2(0, 25));
    }
}