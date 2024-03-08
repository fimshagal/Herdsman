import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { HerdsmanAppConfig } from "./lib";
import { ICanvas } from "pixi.js";
import { Vector2 } from "../../math";
import { Player } from "../entities";
import { AnimalsManager, StatsManager } from "../managers";
import { Background } from "../background";
import { CollectArea } from "../collect.area";
import { AppSize } from "./app.size";
import { ScorePointsCounter } from "../ui";

export class HerdsmanApp {
    private static _singleInstance: HerdsmanApp;
    private static readonly _appSize: number = 840;

    private _pixiApp: PIXI.Application;
    private _raf: PIXI.Ticker;
    private readonly _rootContainer: PIXI.Container;
    private readonly _uiContainer: PIXI.Container;

    private _player: Player = new Player();
    private _collectArea: CollectArea = new CollectArea();
    private _background: Background = new Background();

    private _animalsManager: AnimalsManager = AnimalsManager.getSingle();
    private _statsManager: StatsManager = StatsManager.getSingle();

    private _scorePointsCounter: ScorePointsCounter = new ScorePointsCounter();

    private _isPaused: boolean = false;

    constructor() {
        if (HerdsmanApp._singleInstance) {
            throw Error("HerdsmanApp can't be initialised twice");
        }

        const appSize: number = HerdsmanApp._appSize;

        this._pixiApp = new PIXI.Application({
            width: appSize,
            height: appSize,
            backgroundColor: 0x000000
        });

        this._rootContainer = new PIXI.Container();
        this._rootContainer.sortableChildren = true;

        this._uiContainer = new PIXI.Container();
        this._uiContainer.zIndex = 1;
        this._rootContainer.addChild(this._uiContainer)
        this._rootContainer.sortChildren();

        this._pixiApp.stage.addChild(this._rootContainer);


        this._raf = PIXI.Ticker.shared;
    }

    private injectView(parentElement: HTMLElement): void {
        const view: Node = this._pixiApp.view as unknown as Node;
        parentElement.appendChild(view);
    }

    private update(deltaTime: number): void {
        if (this._isPaused) return;

        TWEEN.update();
        this._collectArea.update(deltaTime);
        this._player.update(deltaTime);
        this._animalsManager.update(deltaTime);
    }

    private listenInput(): void {
        this.listenPointer();
        window.addEventListener('resize', this.resizeScene.bind(this));
    }

    private listenPointer(): void {
        const view: Node = this._pixiApp.view as unknown as Node;
        view.addEventListener('click', this.handleOnClickView.bind(this) as EventListener);
    }

    private followPlayer(): void {
        this._player.onReCalcPosition.add(this.handlePlayerReCalcPosition.bind(this));
    }

    private handlePlayerReCalcPosition(position: Vector2): void {
        this._statsManager.setPlayerPosition(position.clone());
    }

    private handleOnClickView(event: MouseEvent): void {
        const view: ICanvas = this._pixiApp.view as unknown as ICanvas;
        const rect = view.getBoundingClientRect?.();

        const { clientX, clientY } = event;
        const appSize: AppSize = HerdsmanApp.appSize;

        this._player.setTargetPosition(new Vector2(
            clientX - rect!.x - appSize.halfWidth,
            clientY - rect!.y - appSize.halfHeight,
        ));
    }

    private resizeScene(): void {
        const appSize: AppSize = HerdsmanApp.appSize;
        this._rootContainer.x = appSize.halfWidth;
        this._rootContainer.y = appSize.halfHeight;
    }

    private listenStats(): void {
        this._statsManager.onUpdateScorePoints
            .add(async (value: number): Promise<void> => await this._scorePointsCounter.update(value));
    }

    public static getSingle(): HerdsmanApp  {
        if (!HerdsmanApp._singleInstance) {
            HerdsmanApp._singleInstance = new HerdsmanApp();
        }
        return HerdsmanApp._singleInstance;
    }

    public init(options: HerdsmanAppConfig): void {
        const {
            parentElement,
            playerInitConfig,
            animalsManagerInitConfig,
            collectAreaInitConfig,
            scorePointsCounterInitConfig,
            backgroundInitConfig,
        } = options;

        if (!parentElement) return;

        this._background.init(backgroundInitConfig);
        this._collectArea.init(collectAreaInitConfig);
        this._player.init(playerInitConfig);
        this.followPlayer();
        this._statsManager.setPlayerPosition(this._player.position.clone());
        this._animalsManager.init(animalsManagerInitConfig);

        this._scorePointsCounter.init(scorePointsCounterInitConfig);
        this._uiContainer.addChild(this._scorePointsCounter.view!);

        this._rootContainer.addChild(this._background.view!);
        this._rootContainer.addChild(this._collectArea.view!);
        this._rootContainer.addChild(this._animalsManager.view!);
        this._rootContainer.addChild(this._player.view!);

        this.listenStats();

        this.injectView(parentElement);
        this.resizeScene();
        this.listenInput();

        this._raf.add(this.update.bind(this));
    }

    public static get appSize(): AppSize {
        return new AppSize(HerdsmanApp._appSize, HerdsmanApp._appSize);
    }
}