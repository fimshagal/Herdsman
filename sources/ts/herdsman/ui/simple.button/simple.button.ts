import * as PIXI from "pixi.js";
import { Nullable } from "../../../misc";
import { Signal } from "signal-ts";
import { SimpleButtonInitConfig } from "./lib";
import { Vector2 } from "../../../math";

export class SimpleButton {
    private readonly _view: PIXI.Container = new PIXI.Container();

    private _texture: Nullable<PIXI.Texture> = null;
    private _hoverTexture: Nullable<PIXI.Texture> = null;
    private _buttonSprite: Nullable<PIXI.Sprite> = null;

    public onClick: Signal<SimpleButton> = new Signal();

    private _position: Vector2 = Vector2.zero;

    constructor() {
        this._view.interactive = true;
    }

    public init(initConfig: SimpleButtonInitConfig): void {
        this._texture = initConfig.texture;
        this._hoverTexture = initConfig.hoverTexture!;
        this.setPosition(initConfig.initPosition.clone());
        this.createElements();
        this.listen();
    }

    public setPosition(vector2: Vector2): void {
        this._position = vector2.clone();
        this._view!.x = this._position.x;
        this._view!.y = this._position.y;
    }

    private listen(): void {
        this._view.on("mouseenter", (): void => {
            this._buttonSprite!.texture = this._hoverTexture!;
        });
        this._view.on("mouseleave", (): void => {
            this._buttonSprite!.texture = this._texture!;
        });
        this._view.on("click", (): void => this.onClick.emit(this));
    }

    private createElements(): void {
        this._buttonSprite = new PIXI.Sprite(this._texture!);
        this._buttonSprite.anchor.set(0.5);
        this._view.addChild(this._buttonSprite);
    }

    public get view(): PIXI.Container {
        return this._view;
    }
}