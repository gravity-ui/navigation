import {createBlock} from '../utils/cn';

// В Storybook при неправильной конфигурации loaders импорт может вернуть undefined.
// ЯвноFallback к пустому объекту, чтобы не падать и диагностировать проблему.
import rawStyles from './AsideHeader.module.scss';
const styles: Record<string, string> = (rawStyles as any) || ({} as any);

// Debug: verify CSS Modules mapping in Storybook
// eslint-disable-next-line no-console
if (process.env.NODE_ENV !== 'production') {
    // Log once
    const globalAny = globalThis as any;
    if (!globalAny.__GN_DEBUG_ASIDE_HEADER_STYLES__) {
        globalAny.__GN_DEBUG_ASIDE_HEADER_STYLES__ = true;
        // eslint-disable-next-line no-console
        console.log('[AsideHeader.styles typeof]', typeof rawStyles);
        // eslint-disable-next-line no-console
        console.log('[AsideHeader.styles keys]', Object.keys(styles).slice(0, 10));
    }
}

export const b = createBlock('aside-header', styles);
