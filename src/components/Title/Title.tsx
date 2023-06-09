import React from 'react';
import {Button, Icon, Text} from '@gravity-ui/uikit';
import {Xmark} from '@gravity-ui/icons';
import {block} from '../utils/cn';

import './Title.scss';

const b = block('title');

type TitleDictKeys = 'close';
type TitleDict = Record<TitleDictKeys, string>;

const defaultDict: TitleDict = {
    close: 'Close',
};

interface TitleProps {
    hasSeparator?: boolean;
    dict?: TitleDict;
    closeIconSize?: number;
    onClose?: () => void;
}
export const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
    children,
    closeIconSize = 23,
    hasSeparator,
    dict = defaultDict,
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
                        'aria-label': dict['close'],
                    }}
                >
                    <Icon data={Xmark} size={closeIconSize} />
                </Button>
            )}
        </div>
    );
};

Title.displayName = 'Title';
