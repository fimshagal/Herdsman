import * as PIXI from "pixi.js";
import { Vector2 } from "../../../math";
import { ScorePointsCounterInitConfig } from "./lib";
import { Nullable } from "../../../misc";
import * as TWEEN from "@tweenjs/tween.js";

export class ScorePointsCounter {
    private readonly _view: PIXI.Text = new PIXI.Text("");
    private readonly _bumpScaleSequence: number[] = [1.2, 1];
    private readonly _bumpDuration: number = 100;

    private _styles: Partial<PIXI.ITextStyle> | PIXI.TextStyle = {
        fill: "#ffffff",
        fontWeight: "bold",
        fontSize: 62,
    };

    private _position: Vector2 = Vector2.zero;
    private _textValue: string = "";

    public init(config: ScorePointsCounterInitConfig): void {

        this._view.anchor.set(0.5, 0.5);

        if (config.styles) {
            this._styles = config.styles;
        }

        this._view.style = this._styles;

        this.setPosition(config.initPosition.clone());
        this.updateText(config.defaultText);
    }

    private updateText(text: string = ""): void {
        this._textValue = text;
        this._view.text = this._textValue;
    }

    public setPosition(vector2: Vector2): void {
        this._position = vector2.clone();
        this._view!.x = this._position.x;
        this._view!.y = this._position.y;
    }

    public get view(): Nullable<PIXI.Sprite> {
        return this._view;
    }

    public async update(value: any): Promise<void> {
        const bumpScaleSequence: number[] = this._bumpScaleSequence;
        this.updateText(value.toString());
        await new Promise<void>((resolve): void => {
            const onComplete = (): void => resolve();

            new TWEEN.Tween(this._view.scale)
                .to({ x: bumpScaleSequence, y: bumpScaleSequence }, this._bumpDuration)
                .onComplete(onComplete)
                .start();
        });
    }
}