import { Entity } from "./entity";
import { Vector2, MinMax } from "../../math";
import { AnimalInitConfig } from "./lib";
import { Player } from "./player";
import { Nullable, delay } from "../../misc";
import { CollectArea } from "../collect.area";
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from "pixi.js";
import { Signal } from "signal-ts";
import { HerdsmanApp } from "../core/herdsman.app";
import { AppSize } from "../core/app.size";

export class Animal extends Entity {

    private _isFollower: boolean = false;
    private _isCollected: boolean = false;
    private _followTarget: Nullable<Player> = null;
    private _collectTarget: Nullable<CollectArea> = null;
    private _collectTween: Nullable<TWEEN.Tween<any>> = null;
    private _beholdShift: Vector2 = Vector2.zero.randomiseWithinThreshold(25);
    private _catchedTexture: Nullable<PIXI.Texture> = null;
    private _patrolDelayRange: MinMax = MinMax.zero;
    private _patrolStepMaxDistance: number = 0;

    public onFollowPlayer: Signal<Animal> = new Signal<Animal>();
    public onCollected: Signal<Animal> = new Signal<Animal>();

    protected override postDie(): void {
        super.postDie();
        this._isFollower = false;
        this._isCollected = false;
        this._followTarget = null;
        this._collectTarget = null;
    }

    protected override postBorn(): void {
        super.postBorn();
        this._view!.texture = this._texture!;
    }

    public async patrol(): Promise<void> {
        if (this._isFollower || this._isCollected) {
            return;
        }

        const appSize: AppSize = HerdsmanApp.appSize;

        const newPosition: Vector2 = this.position
            .clone()
            .add(Vector2.zero.randomiseWithinThreshold(this._patrolStepMaxDistance))
            .clamp(new MinMax(-appSize.halfWidth, appSize.halfHeight));

        this.setTargetPosition(newPosition);
        await delay(this._patrolDelayRange.randomPoint);
        await this.patrol();
    }

    protected override postInit(initConfig: AnimalInitConfig): void {
        super.postInit(initConfig);
        this._catchedTexture = initConfig.catchedTexture;
        this._patrolDelayRange = initConfig.patrolDelayRange;
        this._patrolStepMaxDistance = initConfig.patrolStepMaxDistance;
        this.patrol();
    }

    protected override postUpdate(): void {
        super.postUpdate();
        if (this._isFollower) {
            this.setTargetPosition(this._followTarget!.followPosition.clone().add(this._beholdShift));
        }
        if (this._isCollected) {
            this.setTargetPosition(this._collectTarget!.collectPosition);
        }
    }

    public followPlayer(target: Player): void {
        if(this._isFollower) return;
        this._isFollower = true;
        this._followTarget = target;
        this._view!.texture = this._catchedTexture!;
        this.setTargetPosition(this._followTarget.followPosition.clone().add(this._beholdShift));
        this.onFollowPlayer.emit(this);

        new TWEEN.Tween(this._rootContainer!.scale)
            .to({ x: 0.8, y: 0.8 }, 50)
            .start();
    }

    public async collect(target: CollectArea): Promise<void> {
        if (this._isCollected) return;

        this._isCollected = true;
        this._isFollower = false;
        this._collectTarget = target;
        this.setTargetPosition(this._collectTarget.collectPosition.clone());
        this.onCollected.emit(this);
        this._collectTween = new TWEEN.Tween(this._rootContainer!.scale).to({ x: 0, y: 0 }, 500);
        this._collectTween!.start();

        await new Promise((resolve): void => {
            this._collectTween!.onComplete(resolve);
        });

        this.die();
    }

    public get isFollower(): boolean {
        return this._isFollower;
    }

    public get isCollected(): boolean {
        return this._isCollected;
    }
}