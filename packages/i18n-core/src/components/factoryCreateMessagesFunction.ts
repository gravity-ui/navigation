import {memoize} from '@formatjs/fast-memoize';
import {type MessageDescriptor, MissingTranslationError} from '@formatjs/intl';

import type {MessageValue, Messages, MultiLocaleMessage} from '@gravity-ui/i18n-types';
import {ResolvedIntlConfigWithLocale} from '../types';
import {getFallbackLocalesList} from '../utils/fallbacks';
import {isLegacyPlural, convertLegacyPluralToICU} from '@gravity-ui/i18n-types';

const isMessageDefined = (message: MessageValue | undefined): message is MessageValue => {
    return message !== null && typeof message !== 'undefined';
};

export function factoryCreateMessagesFunction<TBase, AvailableLocale extends string>(
    config: Pick<
        ResolvedIntlConfigWithLocale<TBase, AvailableLocale>,
        | 'getLocale'
        | 'fallbackLocales'
        | 'disableUseLocaleLangAsFallback'
        | 'allowedLocales'
        | 'defaultFallback'
    >,
) {
    return function createMessages<K extends string>(
        msgs: Messages<AvailableLocale, K>,
    ): Record<K, MessageDescriptor> {
        // TODO Optimize?
        const getMessageDescriptor = memoize(
            ({
                key,
                message,
                currentLocale,
            }: {
                key: string | symbol;
                message: Messages<AvailableLocale, K>[K];
                currentLocale: string;
            }) => {
                const messages = message as MultiLocaleMessage<AvailableLocale>;
                let defaultMessage: MessageValue | undefined =
                    messages?.[currentLocale as AvailableLocale];

                if (!isMessageDefined(defaultMessage)) {
                    // TODO make cache
                    const fallbackLocales = getFallbackLocalesList(currentLocale, config);
                    const fallbackLocale = fallbackLocales.find((locale) =>
                        isMessageDefined(messages?.[locale as AvailableLocale]),
                    );
                    if (fallbackLocale) {
                        defaultMessage = messages?.[fallbackLocale as AvailableLocale];
                    }
                }

                if (!isMessageDefined(defaultMessage)) {
                    if (config.defaultFallback === 'key') {
                        defaultMessage = String(key);
                    } else if (config.defaultFallback === 'empty-string') {
                        defaultMessage = '';
                    } else {
                        throw new MissingTranslationError(
                            {
                                id: String(key),
                            },
                            config.getLocale(),
                        );
                    }
                }

                if (!defaultMessage) {
                    defaultMessage = '';
                }

                if (isLegacyPlural(defaultMessage)) {
                    defaultMessage = convertLegacyPluralToICU(defaultMessage);
                }

                const id = message?.meta?.id || defaultMessage || String(key);

                return {
                    // TODO Think about what to put to error. Use defaultMessage as ID?
                    id,
                    defaultMessage,
                } as MessageDescriptor;
            },
        );

        return new Proxy({} as Record<K, MessageDescriptor>, {
            get(_target, key) {
                const baseMsg = msgs[key as K];

                if (typeof baseMsg === 'undefined') {
                    if (config.defaultFallback === 'key') {
                        return {
                            id: String(key),
                            defaultMessage: String(key),
                        };
                    }

                    if (config.defaultFallback === 'empty-string') {
                        return {
                            id: String(key),
                            defaultMessage: '',
                        };
                    }

                    throw new MissingTranslationError(
                        {
                            id: String(key),
                        },
                        config.getLocale(),
                    );
                }

                return getMessageDescriptor({
                    key,
                    message: baseMsg,
                    currentLocale: config.getLocale(),
                });
            },
        });
    };
}
