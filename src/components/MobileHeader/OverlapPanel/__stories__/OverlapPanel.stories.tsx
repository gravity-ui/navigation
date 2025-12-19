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
        open: true,
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
    const [open, setOpen] = React.useState<boolean>(true);

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setOpen(args.open);
    }, [args.open]);

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" size="l" onClick={() => setOpen(!open)}>
                    {open ? 'Hide' : 'Show'}
                </Button>
            </div>
            <OverlapPanel
                {...args}
                topOffset={77}
                open={open}
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
