import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {BurgerMenu, BurgerMenuInnerProps} from '../BurgerMenu';

import {mobileMenuItemsShowcase} from './moc';

import './BurgerMenuShowcase.scss';

export default {
    title: 'Components/MobileHeader/BurgerMenu',
    component: BurgerMenu,
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

const ShowcaseTemplate: StoryFn<BurgerMenuInnerProps> = () => {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <div className="burger-menu-showcase">
            <BurgerMenu
                items={mobileMenuItemsShowcase}
                modalItem={{
                    renderContent: () => (
                        <div className="burger-menu-showcase__modal-item">Operations</div>
                    ),
                    visible: modalVisible,
                    onClose: () => setModalVisible(false),
                }}
            />
        </div>
    );
};

export const Showcase = ShowcaseTemplate.bind({});
