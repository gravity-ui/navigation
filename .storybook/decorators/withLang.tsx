import React from 'react';
import type {Decorator} from '@storybook/react';
import {Lang, configure} from '@gravity-ui/uikit';

export const withLang: Decorator = (Story, context) => {
    const lang = context.globals.lang;
    const [key, forceRender] = React.useState(0);

    React.useEffect(() => {
        configure({
            lang: lang as Lang,
        });

        forceRender((c) => c + 1);
    }, [lang]);
    return <Story key={key} {...context} />;
};
