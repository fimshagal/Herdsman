import { MinMax } from "./";
import { mathClamp } from "./math.clamp";

export class Vector2 {
    protected _x: number;
    protected _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public static lerp(from: number, to: number, t: number): number {
        return from * (1 - t) + to * t;
    }

    public static distance(vectorA: Vector2, vectorB: Vector2): number {
        const xDiff = vectorB.x - vectorA.x;
        const yDiff = vectorB.y - vectorA.y;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    public clone(): Vector2 {
        return new Vector2(this._x, this._y);
    }

    public clamp(rangeA: MinMax, rangeB?: MinMax): Vector2 {
        if (rangeB) {
            this._x = mathClamp(this._x, rangeA.min, rangeA.max);
            this._y = mathClamp(this._y, rangeB!.min, rangeB!.max);
        } else {
            const { min, max} = rangeA;
            this._x = mathClamp(this._x, min, max);
            this._y = mathClamp(this._y, min, max);
        }
        return this;
    }

    public add(vector2: Vector2): Vector2 {
        this._x += vector2.x;
        this._y += vector2.y;
        return this;
    }

    public remove(vector2: Vector2): Vector2 {
        this._x -= vector2.x;
        this._y -= vector2.y;
        return this;
    }

    public randomiseWithinThreshold(threshold: number): Vector2 {
        const randomize = (value: number): number => value + Math.floor(Math.random() * (threshold * 2 + 1)) - threshold;

        this._x = randomize(this.x);
        this._y = randomize(this.y);

        return this;
    }

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public get zero(): Vector2 {
        return Vector2.zero;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }
}