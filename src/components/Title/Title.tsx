import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';

import {block} from '../utils/cn';

import i18n from './i18n';

import './Title.scss';

const b = block('title');

interface TitleProps {
    hasSeparator?: boolean;
    closeTitle?: string;
    closeIconSize?: number;
    onClose?: () => void;
}
export const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
    children,
    closeIconSize = 23,
    hasSeparator,
    closeTitle = i18n('button_close'),
    onClose,
}) => {
    return (
        <div className={b({separator: hasSeparator})}>
            <Text className={b('text')} as={'h3'} variant={'subheader-3'}>
                {children}
            </Text>
            {onClose && (
                <Button
                    onClick={onClose}
                    view="flat"
                    size="l"
                    extraProps={{
                        'aria-label': closeTitle,
                    }}
                >
                    <Icon data={Xmark} size={closeIconSize} />
                </Button>
            )}
        </div>
    );
};

Title.displayName = 'Title';
