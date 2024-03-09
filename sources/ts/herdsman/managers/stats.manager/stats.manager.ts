import { Signal } from "signal-ts";
import { Vector2 } from "../../../math";

export class StatsManager {
    private static _singleInstance: StatsManager;

    private _scorePoints: number = 0;
    private _lives: number = 5;
    private _playerPosition: Vector2 = Vector2.zero;

    private _gameOver: boolean = false;

    public onUpdateScorePoints: Signal<number> = new Signal();
    public onRemoveLife: Signal<number> = new Signal();
    public onGameOver: Signal<void> = new Signal();

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

    public static addScorePoints(quantity: number): void {
        StatsManager
            .getSingle()
            .addScorePoints(quantity);
    }

    public static removeLife(): void {
        StatsManager
            .getSingle()
            .removeLife();
    }

    public static setPlayerPosition(position: Vector2): void {
        StatsManager
            .getSingle()
            .setPlayerPosition(position);
    }

    public addScorePoints(quantity: number): void {
        this._scorePoints += quantity;
        this.onUpdateScorePoints.emit(this._scorePoints);
    }

    public removeLife(): void {
        this._lives -= 1;
        this.onRemoveLife.emit(this._lives);
        if (this._lives === 0) {
            this.onGameOver.emit();
        }
    }

    public setPlayerPosition(position: Vector2): void {
        this._playerPosition = position;
    }

    public setGameOver() {
        this._gameOver = true;
    }

    public get playerPosition(): Vector2 {
        return this._playerPosition;
    }

    public get lives(): number {
        return this._lives;
    }

    public get gameOver(): boolean {
        return this._gameOver;
    }


    public static get playerPosition(): Vector2 {
        return StatsManager
            .getSingle()
            .playerPosition;
    }

    public static get lives(): number {
        return StatsManager
            .getSingle()
            .lives;
    }

    public static get gameOver(): boolean {
        return StatsManager
            .getSingle()
            .gameOver;
    }

}