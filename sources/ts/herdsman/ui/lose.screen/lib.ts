import { BaseInitConfig } from "../../../init.config/lib";
import {SimpleButtonInitConfig} from "../simple.button/lib";

export interface LoseScreenInitConfig extends BaseInitConfig {
    restartButtonInitConfig: SimpleButtonInitConfig,
}