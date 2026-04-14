import {factoryCreateMessagesFunction} from '../factoryCreateMessagesFunction';

describe('factoryCreateMessagesFunction', () => {
    it('1', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en', 'ru'],
            getLocale: () => 'en',
            fallbackLocales: {},
            defaultFallback: 'en',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: 'Create',
                ru: 'Создать',
            },
        });

        expect(messages['create']).toEqual({
            defaultMessage: 'Create',
            id: 'Create',
        });
    });

    it('2', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'en',
            fallbackLocales: {},
            defaultFallback: 'en',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: 'Create',
                meta: {
                    id: 'create-id',
                },
            },
        });

        expect(messages['create']).toEqual({
            defaultMessage: 'Create',
            id: 'create-id',
        });
    });

    it('3', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'unknown',
            fallbackLocales: {},
            defaultFallback: 'empty-string',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: 'Create',
            },
        });

        expect(messages['create']).toEqual({
            defaultMessage: '',
            id: 'create',
        });
    });

    it('4', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'unknown',
            fallbackLocales: {},
            defaultFallback: 'key',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: 'Create',
            },
        });

        expect(messages['create']).toEqual({
            defaultMessage: 'create',
            id: 'create',
        });
    });

    it('5', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'unknown',
            fallbackLocales: {},
            defaultFallback: 'en',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: null,
            },
        });

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            messages['create'];
        } catch (e) {
            expect(e).toMatchSnapshot('5');
        }
    });

    it('6', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'unknown',
            fallbackLocales: {},
            defaultFallback: 'en',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: null,
            },
        });

        try {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            messages['unknown'];
        } catch (e) {
            expect(e).toMatchSnapshot('6');
        }
    });

    it('missing key with defaultFallback key', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'en',
            fallbackLocales: {},
            defaultFallback: 'key',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: 'Create',
            },
        });

        // @ts-ignore — deliberate unknown key
        expect(messages['not_in_keyset']).toEqual({
            defaultMessage: 'not_in_keyset',
            id: 'not_in_keyset',
        });
    });

    it('missing key with defaultFallback empty-string', () => {
        const createMessagesF = factoryCreateMessagesFunction({
            allowedLocales: ['en'],
            getLocale: () => 'en',
            fallbackLocales: {},
            defaultFallback: 'empty-string',
            disableUseLocaleLangAsFallback: true,
        });

        const messages = createMessagesF({
            create: {
                en: 'Create',
            },
        });

        // @ts-ignore — deliberate unknown key
        expect(messages['not_in_keyset']).toEqual({
            defaultMessage: '',
            id: 'not_in_keyset',
        });
    });
});
