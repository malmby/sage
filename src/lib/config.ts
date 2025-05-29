import toml from '@iarna/toml';

// Use dynamic imports for Node.js modules to prevent client-side errors
let fs: any;
let path: any;
if (typeof window === 'undefined') {
  // We're on the server
  fs = require('fs');
  path = require('path');
}

const configFileName = 'config.toml';

interface ModelEntry {
  model_name: string;
  provider: string;
  api_url: string;
  api_key?: string;
  }

interface Config {
  GENERAL: {
    SIMILARITY_MEASURE: string;
    KEEP_ALIVE: string;
  };
  API_ENDPOINTS: {
    SEARXNG: string;
  };
  MODELS: {
    SPEED?: ModelEntry[];
    QUALITY?: ModelEntry[];
    EMBEDDING?: ModelEntry[];
  };
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const loadConfig = () => {
  // Server-side only
  if (typeof window === 'undefined') {
    return toml.parse(
      fs.readFileSync(path.join(process.cwd(), `${configFileName}`), 'utf-8'),
    ) as any as Config;
  }

  // Client-side fallback - settings will be loaded via API
  return {} as Config;
};

export const getSimilarityMeasure = () => loadConfig().GENERAL.SIMILARITY_MEASURE;
export const getKeepAlive = () => loadConfig().GENERAL.KEEP_ALIVE;

export const getSearxngApiEndpoint = () => process.env.SEARXNG_API_URL || loadConfig().API_ENDPOINTS.SEARXNG;

export const getSpeedModels: ModelEntry[] = parsedConfig.MODELS.SPEED ?? [];
export const getQualityModels: ModelEntry[] = parsedConfig.MODELS.QUALITY ?? [];
export const getEmbeddingModels: ModelEntry[] = parsedConfig.MODELS.EMBEDDING ?? [];

      console.log(getSpeedModels);
      console.log(getQualityModels);
      console.log(getEmbeddingModels);

const mergeConfigs = (current: any, update: any): any => {
  if (update === null || update === undefined) {
    return current;
  }

  if (typeof current !== 'object' || current === null) {
    return update;
  }

  const result = { ...current };

  for (const key in update) {
    if (Object.prototype.hasOwnProperty.call(update, key)) {
      const updateValue = update[key];

      if (
        typeof updateValue === 'object' &&
        updateValue !== null &&
        typeof result[key] === 'object' &&
        result[key] !== null
      ) {
        result[key] = mergeConfigs(result[key], updateValue);
      } else if (updateValue !== undefined) {
        result[key] = updateValue;
      }
    }
  }

  return result;
};

export const updateConfig = (config: RecursivePartial<Config>) => {
  // Server-side only
  if (typeof window === 'undefined') {
    const currentConfig = loadConfig();
    const mergedConfig = mergeConfigs(currentConfig, config);
    fs.writeFileSync(
      path.join(path.join(process.cwd(), `${configFileName}`)),
      toml.stringify(mergedConfig),
    );
  }
};
