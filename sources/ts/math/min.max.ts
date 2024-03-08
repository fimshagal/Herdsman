import { Vector2 } from "./";

export class MinMax extends Vector2{

    public get diff(): number {
        return Math.abs(this._y - this._x);
    }

    public get randomPoint(): number {
        return Vector2.lerp(this.min, this.max, Math.random());
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

    public static override get zero(): MinMax {
        return new MinMax(0, 0);
    }

    public override get zero(): MinMax {
        return MinMax.zero;
    }
}