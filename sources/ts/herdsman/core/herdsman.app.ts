import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { HerdsmanAppConfig } from "./lib";
import { ICanvas } from "pixi.js";
import { Vector2 } from "../../math";
import { Player } from "../entities";
import { EntitiesManager, StatsManager } from "../managers";
import { Background } from "../background";
import { CollectArea } from "../collect.area";
import { AppSize } from "./app.size";
import { LivesCounter, LoseScreen, ScorePointsCounter, HurtScreen, SimpleButton } from "../ui";

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

    private _entitiesManager: EntitiesManager = EntitiesManager.getSingle();
    private _statsManager: StatsManager = StatsManager.getSingle();

    private _scorePointsCounter: ScorePointsCounter = new ScorePointsCounter();
    private _livesCounter: LivesCounter = new LivesCounter();
    private _loseScreen: LoseScreen = new LoseScreen();
    private _hurtScreen: HurtScreen = new HurtScreen();

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
        this._entitiesManager.update(deltaTime);
    }

    private listenInput(): void {
        this.listenPointer();
        window.addEventListener('resize', this.resizeScene.bind(this));
    }

    private listenPointer(): void {
        const view: Node = this._pixiApp.view as unknown as Node;
        view.addEventListener('click', this.handleOnClickView.bind(this) as EventListener);
    }

    private listenPlayer(): void {
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
        this._statsManager.onRemoveLife
            .add(async (value: number): Promise<void> => {
                this._hurtScreen.show();
                this._livesCounter.update(value);
            });

        this._statsManager.onUpdateScorePoints
            .add(async (value: number): Promise<void> => {
                this._scorePointsCounter.update(value);
                this._loseScreen.updateRecordText(value);
            });

        this._statsManager.onGameOver
            .add(this.handleGameOver.bind(this));
    }

    private listenUI(): void {
        this._loseScreen.onClickRestartButton.add(this.restartApplication.bind(this));
    }

    private restartApplication(button: SimpleButton): void {
        location.reload();
    }

    private handleGameOver(): void {
        this._statsManager.setGameOver();
        this._loseScreen.show();
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
            entitiesManagerInitConfig,
            collectAreaInitConfig,
            scorePointsCounterInitConfig,
            backgroundInitConfig,
            livesCounterInitConfig,
            loseScreenInitConfig,
            hurtScreenInitConfig,
        } = options;

        if (!parentElement) return;

        this._background.init(backgroundInitConfig);
        this._collectArea.init(collectAreaInitConfig);
        this._player.init(playerInitConfig);

        this.listenPlayer();

        this._statsManager.setPlayerPosition(this._player.position.clone());
        this._entitiesManager.init(entitiesManagerInitConfig);

        this._scorePointsCounter.init(scorePointsCounterInitConfig);
        this._livesCounter.init(livesCounterInitConfig);
        this._livesCounter.update(StatsManager.lives);

        this._loseScreen.init(loseScreenInitConfig);
        this._hurtScreen.init(hurtScreenInitConfig);

        this._uiContainer.addChild(this._hurtScreen.view!);
        this._uiContainer.addChild(this._scorePointsCounter.view!);
        this._uiContainer.addChild(this._livesCounter.view!);
        this._uiContainer.addChild(this._loseScreen.view!);

        this._rootContainer.addChild(this._background.view!);
        this._rootContainer.addChild(this._collectArea.view!);
        this._rootContainer.addChild(this._entitiesManager.view!);
        this._rootContainer.addChild(this._player.view!);

        this.listenStats();
        this.listenUI();

        this.injectView(parentElement);
        this.resizeScene();
        this.listenInput();

        this._raf.add(this.update.bind(this));
    }

    public static get appSize(): AppSize {
        return new AppSize(HerdsmanApp._appSize, HerdsmanApp._appSize);
    }
}