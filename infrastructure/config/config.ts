
const configFile = require('./dev.yaml')
interface Env {
    env: string | undefined;
    account: string | undefined;
}

interface AppConfig {
    env: string
    account: string
}

const getConfig = (): Env => {
    return {
        env: configFile.env ? configFile.env : 'dev' ,
        account: configFile.account ? configFile.account : 'dev' ,
    };
};

const getSanitzedConfig = (config: Env): AppConfig => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config file`);
        }
    }
    return config as AppConfig;
};

const sanitizedConfig = getSanitzedConfig(getConfig());

export default sanitizedConfig;
