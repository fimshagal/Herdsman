import { Vector2 } from "../../math";

export class AppSize extends Vector2 {
    public get halfWidth(): number {
        return this._x / 2;
    }

    public get halfHeight(): number {
        return this._y / 2;
    }

    public get width(): number {
        return this._x;
    }

    public get height(): number {
        return this._y;
    }
}