import { Vector2 } from "./";

export class MinMax extends Vector2{

    public get diff(): number {
        return Math.abs(this._y - this._x);
    }

    public get randomPoint(): number {
        return Math.random() * (this._y - this._x + 1) + this._x;
    }

    public get min(): number {
        return this._x;
    }

    public get max(): number {
        return this._y;
    }

    public set min(value: number) {
        this._x = value;
    }

    public set max(value: number) {
        this._y = value;
    }
}