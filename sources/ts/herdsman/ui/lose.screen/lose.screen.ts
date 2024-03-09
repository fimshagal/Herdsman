import * as PIXI from "pixi.js";
import { Vector2 } from "../../../math";
import { LoseScreenInitConfig } from "./lib";
import { HerdsmanAssets } from "../../core";
import {Nullable} from "../../../misc";
import {SimpleButtonInitConfig} from "../simple.button/lib";
import {SimpleButton} from "../simple.button";
import { Signal } from "signal-ts";

export class LoseScreen {
    private readonly _view: PIXI.Container = new PIXI.Container();
    private readonly _restartButton: SimpleButton = new SimpleButton();

    private _position: Vector2 = Vector2.zero;
    private _recordText: Nullable<PIXI.Text> = null;
    private _restartButtonInitConfig: Nullable<SimpleButtonInitConfig> = null;

    public onClickRestartButton: Signal<SimpleButton> = new Signal();

    constructor() {
        this._view.visible = false;
    }

    private createRecordTextTemplate(value: any): string {
        return `Your record is ${value}`;
    }

    private createLoseScreenScene() {
        const background: PIXI.Sprite = new PIXI.Sprite(HerdsmanAssets.LoseBackgroundTexture);
        background.anchor.set(0.5);

        const text: PIXI.Text = new PIXI.Text("GAME OVER", {
            dropShadow: false,
            fill: "#ffffff",
            align: "center",
            fontSize: 62,
            fontFamily: "Eagle Lake",
        });

        text.anchor.set(0.5);

        this._recordText = new PIXI.Text(this.createRecordTextTemplate(0), {
            dropShadow: false,
            fill: "#ffffff",
            align: "center",
            fontSize: 36,
            fontFamily: "Eagle Lake",
        });

        this._recordText.y = 80;

        this._recordText.anchor.set(0.5);

        this._restartButton.init(this._restartButtonInitConfig!);

        this._view.addChild(background);
        this._view.addChild(text);
        this._view.addChild(this._recordText);
        this._view.addChild(this._restartButton.view);
    }

    private listenRestartButton(): void {
        this._restartButton.onClick.add((button: SimpleButton) => {
            this.onClickRestartButton.emit(button);
        })
    }

    public init(config: LoseScreenInitConfig): void {
        this._restartButtonInitConfig = config.restartButtonInitConfig;

        this.createLoseScreenScene();
        this.setPosition(config.initPosition.clone());
        this.listenRestartButton();
    }

    public setPosition(vector2: Vector2): void {
        this._position = vector2.clone();
        this._view!.x = this._position.x;
        this._view!.y = this._position.y;
    }

    public updateRecordText(value: any): void {
        this._recordText!.text = this.createRecordTextTemplate(value);
    }

    public get view(): PIXI.Container {
        return this._view;
    }

    public show(): void {
        this._view.visible = true;

    }
}