import { Nullable } from "../../misc";
import { Vector2 } from "../../math";
import * as PIXI from "pixi.js";
import { BackgroundInitConfig } from "./lib";

export class Background {
    private _view: Nullable<PIXI.Sprite> = null;
    private _texture: Nullable<PIXI.Texture> = null
    private _position: Vector2 = Vector2.zero;

    public init(config: BackgroundInitConfig): void {

        this._texture = config.texture;

        this._view = new PIXI.Sprite(this._texture);
        this._view.anchor.set(0.5, 0.5);

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
}