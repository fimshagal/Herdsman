import { Signal } from "signal-ts";
import {Vector2} from "../vector.2";
export class HerdsmanStats {
    private static _singleInstance: HerdsmanStats;

    private _collectedAnimals = 0;
    private _playerPosition: Vector2 = Vector2.zero;

    public onUpdateCollectedAnimals: Signal<number> = new Signal();

    constructor() {
        if (HerdsmanStats._singleInstance) {
            throw Error("HerdsmanStats can't be initialised twice");
        }
    }

    public static getSingle(): HerdsmanStats  {
        if (!HerdsmanStats._singleInstance) {
            HerdsmanStats._singleInstance = new HerdsmanStats();
        }
        return HerdsmanStats._singleInstance;
    }

    public static addAnimals(quantity: number): void {
        HerdsmanStats
            .getSingle()
            .addAnimals(quantity);
    }

    public static setPlayerPosition(position: Vector2): void {
        HerdsmanStats
            .getSingle()
            .setPlayerPosition(position);
    }

    public addAnimals(quantity: number): void {
        this._collectedAnimals += quantity;
        this.onUpdateCollectedAnimals.emit(this._collectedAnimals);
    }

    public setPlayerPosition(position: Vector2): void {
        this._playerPosition = position;
    }



    public get playerPosition(): Vector2 {
        return this._playerPosition;
    }


    public static get playerPosition(): Vector2 {
        return HerdsmanStats
            .getSingle()
            .playerPosition;
    }

}