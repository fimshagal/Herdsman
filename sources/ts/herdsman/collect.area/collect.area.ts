import { CollectAreaInitConfig } from "./lib";
import * as PIXI from "pixi.js";
import { Nullable } from "../../misc";
import {Animal, Entity, PoisonDemon} from "../entities";
import { Vector2 } from "../../math";
import { EntitiesManager, StatsManager } from "../managers";

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
        this.searchEntities(EntitiesManager.allEntities);
    }

    private searchEntities(entities: Entity[]): void {
        const entitiesInRadius: Entity[] = this.getEntitiesInRadius(entities)
            .filter((entity: Entity) => entity.isFollower && !entity.isCollected);

        if (!entitiesInRadius.length) {
            return;
        }

        entitiesInRadius.forEach(async (entity: Entity): Promise<void> => {
            await entity.collect(this);
            if (entity instanceof Animal) {
                StatsManager.addScorePoints(entity.cost);
            }
            if (entity instanceof PoisonDemon) {
                StatsManager.removeLife();
            }
        });
    }


    private getEntitiesInRadius(entities: Entity[]): Entity[] {
        const response: Entity[] = [];
        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i];
            if (this.checkIsEntityInCatchDistance(entity)) {
                response.push(entity);
            }
        }
        return response;
    }

    private checkIsEntityInCatchDistance(entity: Entity): boolean {
        return Vector2.distance(entity.position, this.position) <= this._catchDistance;
    }

    public get position(): Vector2 {
        return this._position;
    }

    public get collectPosition(): Vector2 {
        return this._position.clone().add(new Vector2(0, 25));
    }
}