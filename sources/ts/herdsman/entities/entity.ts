import { Vector2 } from "../../math/vector.2";
import { Nullable } from "../../misc/nullable";
import * as PIXI from "pixi.js";
import { CommonEntityConfig } from "./lib";
import {Signal} from "signal-ts";
import {Texture} from "pixi.js";

export class Entity {
    protected _texture: Nullable<Texture> = null;
    protected _speed: number = 0.01;
    protected _position: Vector2 = new Vector2(0, 0);
    protected _targetPosition: Vector2 = new Vector2(0, 0);
    protected _view: Nullable<PIXI.Sprite> = null;
    protected _alive: boolean = false;
    protected _rootContainer: PIXI.Container = new PIXI.Container();
    public onReCalcPosition: Signal<Vector2> = new Signal();

    public onDie: Signal<any> = new Signal();

    public init(config: CommonEntityConfig): void {
        this._speed = config.speed;

        this._texture = config.texture;
        this._view = new PIXI.Sprite(config.texture);
        this._view.anchor.set(0.5, 0.5);


        this._rootContainer.addChild(this._view);
        this._rootContainer.visible = false;

        this.setPosition(config.initPosition.clone());

        if (config.autoBorn) {
            this.born();
        }

        this.postInit(config);
    }

    public born(): void {
        if (this._alive) return;

        this._alive = true;
        this._rootContainer!.visible = true;
        this.postBorn();
    }

    public die(): void {
        if (!this._alive) return;

        this._alive = false;
        this._rootContainer!.visible = false;
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
        this.postUpdate();
    }

    protected postUpdate(): void {}
    protected postInit(initConfig: CommonEntityConfig): void {}


    protected reCalcPosition(deltaTime: number): void {
        const position: Vector2 = this._position;
        const targetPosition: Vector2 = this._targetPosition;
        const calcSpeed: number = this._speed * deltaTime;

        this._position = new Vector2(
            Vector2.lerp(position.x, targetPosition.x, calcSpeed),
            Vector2.lerp(position.y, targetPosition.y, calcSpeed),
        );

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
}