import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import type {Meta, StoryFn} from '@storybook/react';

const b = cn('overlap-panel-showcase');

import {cn} from '../../../utils/cn';
import {OverlapPanel, OverlapPanelProps} from '../OverlapPanel';

import {PlaceholderText} from './moc';

import './OverlapPanel.scss';

export default {
    title: 'Components/MobileHeader/OverlapPanel',
    component: OverlapPanel,
    args: {
        title: 'Title',
        visible: true,
    },
    decorators: [
        (DecoratedStory) => {
            return (
                <div>
                    <DecoratedStory />
                </div>
            );
        },
    ],
    parameters: {
        a11y: {
            element: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'duplicate-id',
                        enabled: false,
                        selector: 'defs', // one may use same id in different <defs>
                    },
                    {
                        id: 'aria-allowed-attr', // https://github.com/gravity-ui/uikit/issues/1336
                        enabled: false,
                    },
                    {
                        id: 'color-contrast',
                        enabled: false,
                    },
                ],
            },
        },
    },
} as Meta;

const ShowcaseTemplate: StoryFn<OverlapPanelProps> = (args) => {
    const [visible, setVisible] = React.useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
    };

    React.useEffect(() => {
        setVisible(args.visible);
    }, [args.visible]);

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" size="l" onClick={() => setVisible(!visible)}>
                    {visible ? 'Hide' : 'Show'}
                </Button>
            </div>
            <OverlapPanel
                {...args}
                topOffset={77}
                visible={visible}
                onClose={handleClose}
                renderContent={() => (
                    <div className={b('content')}>
                        <PlaceholderText />
                    </div>
                )}
                action={{
                    onClick: () => alert('Action Click'),
                    icon: Plus,
                    title: 'Create',
                }}
            />
        </div>
    );
};

export const Showcase = ShowcaseTemplate.bind({});
