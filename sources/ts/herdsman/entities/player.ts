import { Entity } from "./entity";
import { Animal } from "./animal";
import { AnimalsManager } from "../managers/animals.manager/animals.manager";
import { CommonEntityConfig, PlayerInitConfig } from "./lib";
import { Vector2 } from "../../math/vector.2";
import * as PIXI from "pixi.js";
import { HerdsmanAssets } from "../core/herdsman.assets";
import { Nullable } from "../../misc/nullable";

export class Player extends Entity {
    private _catchDistance: number = 0;
    private _glow: Nullable<PIXI.Sprite> = null;

    protected override postUpdate(): void {
        super.postUpdate();
        this.setGlowByFollowersAmount();
        this.searchAnimals(AnimalsManager.animals);
    }

    protected override postInit(initConfig: CommonEntityConfig): void {
        super.postInit(initConfig);

        const playerInitConfig = {...initConfig} as PlayerInitConfig;

        this._catchDistance = playerInitConfig.catchDistance;

        this.addGlow();
    }

    private setGlowByFollowersAmount(): void {
        this._glow!.alpha = 1 - AnimalsManager.playerFollowersAmount / 5;
    }

    private addGlow(): void {
        this._glow = new PIXI.Sprite(HerdsmanAssets.PlayerGlowTexture);
        this._glow.anchor.set(0.5);
        this._rootContainer.addChild(this._glow);
        this._rootContainer.addChild(this._view!);
    }

    private searchAnimals(animals: Animal[]): void {

        if (AnimalsManager.playerFollowersAmount > 5) {
            return;
        }

        const animalsInRadius: Animal[] = this.getAnimalsInRadius(animals);

        if (!animalsInRadius.length) {
            return;
        }



        animalsInRadius.forEach((animal: Animal): void => {
            animal.followPlayer(this);
        });
    }

    private getAnimalsInRadius(animals: Animal[]): Animal[] {
        const response: Animal[] = [];
        for (let i: number = 0; i < animals.length; i++) {
            const animal: Animal = animals[i];
            if(animal.isFollower || animal.isCollected) {
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

    public get followPosition(): Vector2 {
        return this._position
            .clone()
            .add(new Vector2(50, 50));
    }
}