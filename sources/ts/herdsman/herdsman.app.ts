import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import { HerdsmanAppConfig } from "./herdsman.interfaces";
import {ICanvas} from "pixi.js";
import { Vector2 } from "../vector.2";
import {Player} from "./player";
import {AnimalsManager} from "./animals.manager";
import {HerdsmanStats} from "./herdsman.stats";
import {resizeConfig} from "./resize.config";
import {HerdsmanAssets} from "./herdsman.assets";
import {CollectArea} from "./collect.area";
import {Nullable} from "../nullable";

export class HerdsmanApp {
    private static _singleInstance: HerdsmanApp;
    private static readonly _appSize: number = 840;

    private _pixiApp: PIXI.Application;
    private _raf: PIXI.Ticker;
    private _rootContainer: PIXI.Container;
    private _uiContainer: PIXI.Container;

    private _player: Player = new Player();
    private _collectArea: CollectArea = new CollectArea();
    private _animalsManager: AnimalsManager = AnimalsManager.getSingle();
    private _statsManager: HerdsmanStats = HerdsmanStats.getSingle();

    private _collectedAnimalsCounter: Nullable<PIXI.Text> = null;

    private _isPaused: boolean = false;

    constructor() {
        if (HerdsmanApp._singleInstance) {
            throw Error("HerdsmanApp can't be initialised twice");
        }

        const appSize: number = HerdsmanApp._appSize;

        this._pixiApp = new PIXI.Application({
            width: appSize,
            height: appSize,
            backgroundColor: 0x1AAA01
        });

        this._rootContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
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

    private followInput(): void {
        this.followPointer();
        window.addEventListener('resize', this.resizeScene.bind(this));
    }

    private followPointer(): void {
        const view: Node = this._pixiApp.view as unknown as Node;

        // @ts-ignore
        view.addEventListener('click', this.handleOnClickView.bind(this));
    }

    private followPlayer(): void {
        this._player.onReCalcPosition.add((position: Vector2): void => {
            this._statsManager.setPlayerPosition(position.clone());
        });
    }

    private handleOnClickView(event: MouseEvent): void {
        const view: ICanvas = this._pixiApp.view as unknown as ICanvas;
        const rect = view.getBoundingClientRect?.();
        const { renderer} = this._pixiApp;
        const targetPosition = new Vector2(event.clientX - rect!.x - (renderer.width / 2), event.clientY - rect!.y - (renderer.height / 2));

        this._player.setTargetPosition(targetPosition);
    }

    private resizeScene(): void {
        this._rootContainer.x = this._pixiApp.renderer.width / 2;
        this._rootContainer.y = this._pixiApp.renderer.height / 2;
    }

    private addBackground(): void {
        const background: PIXI.Sprite = new PIXI.Sprite(HerdsmanAssets.BackgroundTexture);
        background.x = resizeConfig.background.x;
        background.y = resizeConfig.background.y;
        this._rootContainer.addChild(background);
    }

    private initUI(): void {
        this._rootContainer.addChild(this._uiContainer);

        this._collectedAnimalsCounter = new PIXI.Text("0", {
            dropShadow: false,
            strokeThickness: 8,
            stroke: "#100e36",
            fill: "#ff9900",
            fontWeight: "bold",
            fontSize: 62,
            fontFamily: "Eagle Lake"
        });

        const collectedAnimalsCounter = this._collectedAnimalsCounter;
        collectedAnimalsCounter.anchor.x = 0.5;
        collectedAnimalsCounter.anchor.y = 0.5;
        collectedAnimalsCounter.x = resizeConfig.collectedAnimalsCounter.x;
        collectedAnimalsCounter.y = resizeConfig.collectedAnimalsCounter.y;

        this._uiContainer.addChild(this._collectedAnimalsCounter);
    }

    private async updateCollectedAnimalsCounter(text: string): Promise<void> {
        this._collectedAnimalsCounter!.text = text;
        await new Promise<void>((resolve): void => {
            const onComplete = () => {
                resolve();
            };

            new TWEEN.Tween(this._collectedAnimalsCounter!.scale)
                .to({ x: [1.2, 1], y: [1.2, 1] }, 100)
                .onComplete(onComplete)
                .start();
        })
    }

    private followStats(): void {
        this._statsManager.onUpdateCollectedAnimals
            .add(async (value: number): Promise<void> => await this.updateCollectedAnimalsCounter(`${value}`));
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
        } = options;

        if (!parentElement) return;

        this.addBackground();

        this._collectArea.init(collectAreaInitConfig);
        this._player.init(playerInitConfig);
        this.followPlayer();
        this._statsManager.setPlayerPosition(this._player.position.clone());
        this._animalsManager.init(animalsManagerInitConfig);

        this.initUI();

        this._rootContainer.addChild(this._collectArea.view!);
        this._rootContainer.addChild(this._animalsManager.view!);
        this._rootContainer.addChild(this._player.view!);

        this.followStats();

        this.injectView(parentElement);
        this.resizeScene();
        this.followInput();

        this._raf.add(this.update.bind(this));
    }
}