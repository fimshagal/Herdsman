import { Signal } from "signal-ts";
import { Vector2 } from "../../../math/vector.2";

export class StatsManager {
    private static _singleInstance: StatsManager;

    private _collectedAnimals = 0;
    private _playerPosition: Vector2 = Vector2.zero;

    public onUpdateCollectedAnimals: Signal<number> = new Signal();

    constructor() {
        if (StatsManager._singleInstance) {
            throw Error("StatsManager can't be initialised twice");
        }
    }

    public static getSingle(): StatsManager  {
        if (!StatsManager._singleInstance) {
            StatsManager._singleInstance = new StatsManager();
        }
        return StatsManager._singleInstance;
    }

    public static addAnimals(quantity: number): void {
        StatsManager
            .getSingle()
            .addAnimals(quantity);
    }

    public static setPlayerPosition(position: Vector2): void {
        StatsManager
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
        return StatsManager
            .getSingle()
            .playerPosition;
    }

}