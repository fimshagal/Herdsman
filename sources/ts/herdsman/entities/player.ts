import { Entity, Animal } from "./";
import { AnimalsManager } from "../managers";
import { CommonEntityConfig, PlayerInitConfig } from "./lib";
import { Vector2 } from "../../math";
import * as PIXI from "pixi.js";
import { HerdsmanAssets } from "../core/herdsman.assets";
import { Nullable } from "../../misc";

export class Player extends Entity {
    private _catchDistance: number = 0;
    private _maxFollowers: number = 1;
    private _glow: Nullable<PIXI.Sprite> = null;
    private _followPositionOffset: Vector2 = Vector2.zero;

    protected override postUpdate(): void {
        super.postUpdate();
        this.setGlowByFollowersAmount();
        this.searchAnimals(AnimalsManager.animals);
    }

    protected override postInit(initConfig: CommonEntityConfig): void {
        super.postInit(initConfig);

        const playerInitConfig = {...initConfig} as PlayerInitConfig;

        this._catchDistance = playerInitConfig.catchDistance;

        if (playerInitConfig.maxFollowers) {
            this._maxFollowers = playerInitConfig.maxFollowers;
        }

        if (playerInitConfig.followPositionOffset) {
            this._followPositionOffset = playerInitConfig.followPositionOffset;
        }

        this.addGlow();
    }

    private setGlowByFollowersAmount(): void {
        this._glow!.alpha = 1 - (AnimalsManager.playerFollowersAmount / this._maxFollowers);
    }

    private addGlow(): void {
        this._glow = new PIXI.Sprite(HerdsmanAssets.PlayerGlowTexture);
        this._glow.anchor.set(0.5);
        this._rootContainer.addChild(this._glow);
        this._rootContainer.addChild(this._view!);
    }

    private searchAnimals(animals: Animal[]): void {

        if (AnimalsManager.playerFollowersAmount >= this._maxFollowers) {
            return;
        }

        const animalsInRadius: Animal[] = this.getAnimalsInRadius(animals);

        if (!animalsInRadius.length) {
            return;
        }

        animalsInRadius
            .forEach((animal: Animal): void => animal.followPlayer(this));
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
            .add(this._followPositionOffset);
    }
}