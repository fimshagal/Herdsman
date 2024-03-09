import * as PIXI from "pixi.js";
import { Vector2 } from "../../../math";
import { Nullable } from "../../../misc";
import {LivesCounterInitConfig} from "./lib";

export class LivesCounter {
    private readonly _view: PIXI.Container = new PIXI.Container();

    private _position: Vector2 = Vector2.zero;
    private _texture: Nullable<PIXI.Texture> = null;
    private _value: number = 0;

    public init(config: LivesCounterInitConfig): void {
        this._texture = config.texture;
        this.setPosition(config.initPosition.clone());
    }

    private updateItems(): void {
        if (!this._texture) {
            return;
        }

        this._view.removeChildren();

        let x: number = 0;

        for (let i = 0; i < this._value; i++) {
            const sprite: PIXI.Sprite = new PIXI.Sprite(this._texture);
            sprite.x = x;
            sprite.anchor.set(0.5);
            this._view.addChild(sprite);
            x += sprite.width;
        }
    }

    public setPosition(vector2: Vector2): void {
        this._position = vector2.clone();
        this._view!.x = this._position.x;
        this._view!.y = this._position.y;
    }

    public get view(): PIXI.Container {
        return this._view;
    }

    public update(value: number): void {
        this._value = value;
        this.updateItems();
    }
}