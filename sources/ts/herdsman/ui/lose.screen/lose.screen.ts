import * as PIXI from "pixi.js";
import { Vector2 } from "../../../math";
import {LoseScreenInitConfig} from "./lib";
import {HerdsmanAssets} from "../../core/herdsman.assets";

export class LoseScreen {
    private readonly _view: PIXI.Container = new PIXI.Container();

    private _position: Vector2 = Vector2.zero;

    constructor() {
        this._view.visible = false;
    }

    private createLoseScreenScene() {
        const background: PIXI.Sprite = new PIXI.Sprite(HerdsmanAssets.LoseBackgroundTexture);
        background.anchor.set(0.5);

        const text = new PIXI.Text("GAME OVER", {
            dropShadow: false,
            fill: "#ffffff",
            align: "center",
            fontSize: 62,
            fontFamily: "Eagle Lake",
        });

        text.anchor.set(0.5);

        this._view.addChild(background);
        this._view.addChild(text);
    }

    public init(config: LoseScreenInitConfig): void {
        this.createLoseScreenScene();
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

    public show(): void {
        this._view.visible = true;
    }

    public hide(): void {
        this._view.visible = false;
    }
}