import { Entity } from "./";
import { EntitiesManager } from "../managers";
import { CommonEntityConfig, PlayerInitConfig } from "./lib";
import { Vector2 } from "../../math";
import * as PIXI from "pixi.js";
import { HerdsmanAssets } from "../core";
import { Nullable } from "../../misc";

export class Player extends Entity {
    private _catchDistance: number = 0;
    private _maxFollowers: number = 1;
    private _glow: Nullable<PIXI.Sprite> = null;

    protected override postUpdate(): void {
        super.postUpdate();
        this.setGlowByFollowersAmount();
        this.searchEntities(EntitiesManager.allEntities);
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
        this._glow!.alpha = 1 - (EntitiesManager.playerFollowersAmount / this._maxFollowers);
    }

    private addGlow(): void {
        this._glow = new PIXI.Sprite(HerdsmanAssets.PlayerGlowTexture);
        this._glow.anchor.set(0.5);
        this._rootContainer.addChild(this._glow);
        this._rootContainer.addChild(this._view!);
    }

    private searchEntities(entities: Entity[]): void {

        if (EntitiesManager.playerFollowersAmount >= this._maxFollowers) {
            return;
        }

        const entitiesInRadius: Entity[] = this.getEntitiesInRadius(entities)
            .filter((entity: Entity) => !entity.isFollower && !entity.isCollected && entity.followAble);

        if (!entitiesInRadius.length) {
            return;
        }

        entitiesInRadius
            .forEach((entity: Entity): void => entity.followTarget(this));
    }

    private getEntitiesInRadius(entities: Entity[]): Entity[] {
        const response: Entity[] = [];
        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i];

            if (this.checkIsEntitiesInCatchDistance(entity)) {
                response.push(entity);
            }
        }
        return response;
    }

    private checkIsEntitiesInCatchDistance(entity: Entity): boolean {
        return Vector2.distance(entity.position, this.position) <= this._catchDistance;
    }

    public get followPosition(): Vector2 {
        return this._position
            .clone()
            .add(this._followPositionOffset);
    }
}