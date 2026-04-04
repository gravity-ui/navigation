import {cosmiconfigSync} from 'cosmiconfig';
import {TypeScriptLoaderSync} from 'cosmiconfig-typescript-loader';
import {log, MODULE_NAME} from '../shared';
import {ProjectConfig} from './types';

const DEFAULT_LOCALES = ['ru', 'en'];
const DEFAULT_CLIENT_INTL_PATH = 'src/ui/shared/i18n.ts';
const DEFAULT_SERVER_INTL_PATH = 'src/server/utils/i18n.ts';
const DEFAULT_SERVER_PATH_MATCHERS = [/src\/server\/.+$/];

type RequiredConfigOption = 'clientIntlModule' | 'serverIntlModule';

export type NormalizedProjectConfig = Omit<ProjectConfig, RequiredConfigOption> &
    Required<Pick<ProjectConfig, RequiredConfigOption>>;

function normalizeProjectConfig(projectConfig?: ProjectConfig): NormalizedProjectConfig {
    const clientIntlModule = projectConfig?.clientIntlModule;
    const serverIntlModule = projectConfig?.serverIntlModule;

    return {
        ...projectConfig,
        allowedLocales: projectConfig?.allowedLocales || DEFAULT_LOCALES,
        clientIntlModule: {
            ...clientIntlModule,
            path: clientIntlModule?.path || DEFAULT_CLIENT_INTL_PATH,
        },
        serverIntlModule: {
            ...serverIntlModule,
            path: serverIntlModule?.path || DEFAULT_SERVER_INTL_PATH,
            pathMatchers: serverIntlModule?.pathMatchers || DEFAULT_SERVER_PATH_MATCHERS,
        },
    };
}

// Порядок влияет на приоритеты
const DEFAULT_SEARCH_PLACES = ['i18n.config.ts', 'i18n.config.js'];

let cachedProjectConfig: NormalizedProjectConfig | undefined;

export const loadProjectConfig = (searchPlaces?: string[]): NormalizedProjectConfig => {
    if (cachedProjectConfig) {
        return cachedProjectConfig;
    }

    const explorer = cosmiconfigSync(MODULE_NAME, {
        cache: false,
        stopDir: searchPlaces ? undefined : process.cwd(),
        searchPlaces: searchPlaces ?? DEFAULT_SEARCH_PLACES,
        loaders: {
            '.ts': TypeScriptLoaderSync(),
        },
    });

    const cfg = explorer.search();

    if (!cfg) {
        log('i18n config not found. Using default values');
    }

    const config = cfg?.config as ProjectConfig | undefined;

    cachedProjectConfig = normalizeProjectConfig(config);
    return cachedProjectConfig;
};
