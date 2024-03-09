import {MinMax, Vector2} from "../../math";
import {delay, Nullable} from "../../misc";
import * as PIXI from "pixi.js";
import { CommonEntityConfig } from "./lib";
import {Signal} from "signal-ts";
import {AppSize} from "../core/app.size";
import {HerdsmanApp} from "../core/herdsman.app";
import {Player} from "./player";
import {CollectArea} from "../collect.area";
import * as TWEEN from "@tweenjs/tween.js";

export class Entity {
    protected _texture: Nullable<PIXI.Texture> = null;
    protected _textures: PIXI.Texture[] = [];
    protected _cost: number = 0;
    protected _speed: number = 0.01;

    protected _position: Vector2 = Vector2.zero;
    protected _targetPosition: Vector2 = Vector2.zero;
    protected _followPositionOffset: Vector2 = Vector2.zero;

    protected _view: Nullable<PIXI.Sprite> = null;

    protected _rootContainer: PIXI.Container = new PIXI.Container();

    protected _alive: boolean = false;
    protected _doPatrol: boolean = false;
    protected _respawnAble: boolean = false;
    protected _followAble: boolean = false;
    protected _isFollower: boolean = false;
    protected _isCollected: boolean = false;

    protected _followedTarget: Nullable<Entity | Player> = null;
    protected _collectTarget: Nullable<CollectArea> = null;
    protected _collectTween: Nullable<TWEEN.Tween<any>> = null;
    protected _catchedTexture: Nullable<PIXI.Texture> = null;
    protected _patrolDelayRange: MinMax = MinMax.zero;
    protected _beholdShift: Vector2 = Vector2.zero;
    protected _patrolStepMaxDistance: number = 0;

    public onFollowTarget: Signal<Entity> = new Signal<Entity>();
    public onCollected: Signal<Entity> = new Signal<Entity>();
    public onReCalcPosition: Signal<Vector2> = new Signal();
    public onDie: Signal<any> = new Signal();

    public async patrol(): Promise<void> {
        if (this._isFollower || this._isCollected || !this._doPatrol) {
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

    public init(config: CommonEntityConfig): void {
        this._speed = config.speed;

        this._cost = config.cost!;

        this._texture = config.texture;
        this._textures = config.textures!;

        this._view = new PIXI.Sprite(config.texture);
        this._view.anchor.set(0.5, 0.5);

        this._followAble = config.followAble;

        if (config.doPatrol) {
            this._doPatrol = config.doPatrol;
            this._patrolDelayRange = config.patrolDelayRange!;
            this._patrolStepMaxDistance = config.patrolStepMaxDistance!;
        }

        this._respawnAble = config.respawnAble;


        this._rootContainer.addChild(this._view);
        this._rootContainer.visible = false;

        this._catchedTexture = config.catchedTexture!;
        this._beholdShift = config.beholdShift!;

        this.setPosition(config.initPosition);

        if (config.autoBorn) {
            this.born();
        }

        if (config.doPatrol) {
            this.patrol();
        }

        this.postInit(config);
    }

    public born(): void {
        if (this._alive) return;

        this._alive = true;
        this._rootContainer!.visible = true;
        this._view!.texture = this._texture!;
        this.postBorn();
    }

    public die(): void {
        if (!this._alive) return;

        this._alive = false;
        this._rootContainer!.visible = false;
        this._isFollower = false;
        this._isCollected = false;
        this._followedTarget = null;
        this._collectTarget = null;

        this.postDie();

        this.onDie.emit(this);
    }

    protected postDie(): void {

    }

    protected postBorn(): void {

    }

    public update(deltaTime: number): void {
        if (!this._alive) {
            return;
        }

        this.reCalcPosition(deltaTime);
        this.updateViewPosition();

        if (this._isFollower) {
            this.setTargetPosition(this._followedTarget!.followPosition.clone().add(this._beholdShift));
        }
        if (this._isCollected) {
            this.setTargetPosition(this._collectTarget!.collectPosition);
        }

        this.postUpdate();
    }

    protected postUpdate(): void {}
    protected postInit(initConfig: CommonEntityConfig): void {}


    protected reCalcPosition(deltaTime: number): void {
        const position: Vector2 = this._position;
        const targetPosition: Vector2 = this._targetPosition;
        const calcSpeed: number = this._speed * deltaTime;

        const newPosition = new Vector2(
            Vector2.lerp(position.x, targetPosition.x, calcSpeed),
            Vector2.lerp(position.y, targetPosition.y, calcSpeed),
        );

        if (!this.isFollower && !this.isCollected && this._alive) {
            this._view!.scale.x = newPosition.x < this._position.x ? -1 : 1;
        }

        this._position = newPosition;

        this.onReCalcPosition.emit(this._position.clone());
    }

    protected updateViewPosition(): void {
        this._rootContainer!.x = this._position.x;
        this._rootContainer!.y = this._position.y;
    }

    public setTargetPosition(vector2: Vector2): void {
        this._targetPosition = vector2;
    }

    public setPosition(vector2: Vector2): void {
        this._targetPosition = vector2.clone();
        this._position = vector2.clone();
        this._rootContainer!.x = this._position.x;
        this._rootContainer!.y = this._position.y;
    }

    public get view(): Nullable<PIXI.Container> {
        return this._rootContainer;
    }

    public get position(): Vector2 {
        return this._position;
    }

    public get cost(): number {
        return this._cost;
    }

    public followTarget(target: Entity | Player): void {
        if(this._isFollower) return;

        this._isFollower = true;
        this._followedTarget = target;
        if(this._catchedTexture) {
            this._view!.texture = this._catchedTexture;
        }
        this._view!.scale.x = 1;
        this.setTargetPosition(this._followedTarget!.followPosition.clone().add(this._beholdShift));
        this.onFollowTarget.emit(this);

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

    public get followAble(): boolean {
        return this._followAble;
    }

    public get followPosition(): Vector2 {
        return this._position
            .clone()
            .add(this._followPositionOffset);
    }
}