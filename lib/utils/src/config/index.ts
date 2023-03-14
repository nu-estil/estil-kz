import { DeepPartial } from './types';

export class ConfigUtils<TAppConfig> {
    private config;

    constructor(configDir: string) {
        process.env.NODE_CONFIG_DIR = configDir;
        this.config = require('config');
    }

    get<T extends keyof TAppConfig>(key: T): TAppConfig[T] {
        return this.config.get(key as string);
    }

    getConfig(): TAppConfig {
        return this.config.util.toObject();
    }

    static createConfig<TAppConfig>(defaultConfig: TAppConfig): TAppConfig {
        return defaultConfig;
    }

    static createAppEnvConfig<TAppConfig>(
        envConfig: DeepPartial<TAppConfig>,
    ): DeepPartial<TAppConfig> {
        return envConfig;
    }
}
