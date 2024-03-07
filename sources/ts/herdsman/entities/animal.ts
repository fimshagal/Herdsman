import { Entity } from "./entity";
import { Vector2 } from "../../math/vector.2";
import { AnimalInitConfig } from "../core/lib";
import { Player } from "./player";
import { Nullable } from "../../misc/nullable";
import { CollectArea } from "../collect.area/collect.area";
import * as TWEEN from '@tweenjs/tween.js';
import { delay } from "../../misc/delay";
import { MinMax } from "../../math/min.max";
import * as PIXI from "pixi.js";
import {Signal} from "signal-ts";

export class Animal extends Entity {

    private _isFollower: boolean = false;
    private _isCollected: boolean = false;
    private _followTarget: Nullable<Player> = null;
    private _collectTarget: Nullable<CollectArea> = null;
    private _collectTween: Nullable<TWEEN.Tween<any>> = null;
    private _beholdShift: Vector2 = Vector2.zero.randomiseWithinThreshold(25);
    private _catchedTexture: Nullable<PIXI.Texture> = null;

    public onFollowPlayer: Signal<Animal> = new Signal<Animal>();
    public onCollected: Signal<Animal> = new Signal<Animal>();

    protected override postDie() {
        super.postDie();
        this._isFollower = false;
        this._isCollected = false;
        this._followTarget = null;
        this._collectTarget = null;
    }

    protected override postBorn() {
        super.postBorn();
        this._view!.texture = this._texture!;
    }

    public async patrol(): Promise<void> {
        // TODO this fn need to be refactored!
        // TODO this fn need to be refactored!
        // TODO this fn need to be refactored!

        if (this._isFollower || this._isCollected) {
            return;
        }

        const randomFactor: number = Math.floor(Math.random() * 1000) + 50;
        await delay(randomFactor);
        const newPosition = this.position
            .clone()
            .add(Vector2.zero.randomiseWithinThreshold(150))
            .clamp(new MinMax(-420, 420));

        this.setTargetPosition(newPosition);
        await delay(randomFactor * 3);
        await this.patrol();

        // TODO this fn need to be refactored!
        // TODO this fn need to be refactored!
        // TODO this fn need to be refactored!
    }

    protected override postInit(initConfig: AnimalInitConfig) {
        super.postInit(initConfig);
        this._catchedTexture = initConfig.catchedTexture;
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