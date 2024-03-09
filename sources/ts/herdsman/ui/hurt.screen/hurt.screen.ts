import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { Vector2 } from "../../../math";
import { HurtScreenInitConfig } from "./lib";
import { HerdsmanAssets } from "../../core";
import { Nullable } from "../../../misc";

export class HurtScreen {
    private readonly _view: PIXI.Container = new PIXI.Container();

    private _position: Vector2 = Vector2.zero;
    private _showTween: Nullable<TWEEN.Tween<any>> = null;

    constructor() {
        this._view.visible = false;
        this._view.alpha = 0;
    }

    private createHurtScreenScene() {
        const background: PIXI.Sprite = new PIXI.Sprite(HerdsmanAssets.HurtBackgroundTexture);
        background.anchor.set(0.5);
        this._view.addChild(background);
    }

    public init(config: HurtScreenInitConfig): void {
        this.createHurtScreenScene();
        this.setPosition(config.initPosition.clone());
    }

    public setPosition(vector2: Vector2): void {
        this._position = vector2.clone();
        this._view!.x = this._position.x;
        this._view!.y = this._position.y;
    }

    public get view(): PIXI.Container {
        return this._view;
    }

    public async show(): Promise<void> {
        this._view.visible = true;
        this._showTween = new TWEEN.Tween(this._view).to({ alpha: [1, 0] }, 750);
        this._showTween!.start();
        return await new Promise((resolve): void => {
            this._showTween!.onComplete(resolve);
        });
    }
}