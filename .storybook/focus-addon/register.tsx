import {addons} from 'storybook/manager-api';

addons.register('initialFocus', () => {
    addons.getChannel().on('currentStoryWasSet', () => focusIframe());
});

const focusIframe = () => {
    const previewIframe: HTMLInputElement | null = document.querySelector(
        '#storybook-preview-iframe',
    );

    previewIframe?.focus?.();
};
