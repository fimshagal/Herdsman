import { MinMax } from "./min.max";
import { Vector2 } from "./vector.2";

export const getRandomXYInRange = (range: MinMax): Vector2 => {
    const theta: number = Math.random() * 2 * Math.PI;
    const distance: number = Math.random() * range.diff + range.min;
    return new Vector2(distance * Math.cos(theta), distance * Math.sin(theta));
}