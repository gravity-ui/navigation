import React from 'react';
import {Story as StoryType, StoryContext} from '@storybook/react';
import {ThemeProvider} from '@gravity-ui/uikit';

export function withTheme(Story: StoryType, context: StoryContext) {
    return (
        <ThemeProvider theme={context.globals.theme}>
            <Story {...context} />
        </ThemeProvider>
    );
}
