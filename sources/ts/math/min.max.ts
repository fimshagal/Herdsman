export class MinMax {
    private _min: number;
    private _max: number;

    constructor(min: number, max: number) {
        this._min = min;
        this._max = max;
    }

    public clone(): MinMax {
        return new MinMax(this._min, this._max);
    }

    public get diff(): number {
        return Math.abs(this._max - this._min);
    }

    public get randomPoint(): number {
        return Math.random() * (this._max - this._min + 1) + this._min;
    }

    public get min(): number {
        return this._min;
    }

    public get max(): number {
        return this._max;
    }

    public set min(value: number) {
        this._min = value;
    }

    public set max(value: number) {
        this._max = value;
    }
}