import { I18N } from './index.es142.js';
import { getConfig } from './index.es143.js';

const configLang = getConfig().lang;
const i18n = new I18N({ lang: configLang, fallbackLang: configLang });

export { i18n };
//# sourceMappingURL=index.es118.js.map
