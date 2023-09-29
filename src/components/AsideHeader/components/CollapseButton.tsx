import React, {useCallback} from 'react';
import {Button, Icon} from '@gravity-ui/uikit';

import {fakeDisplayName} from '../../helpers';
import i18n from '../i18n';

import {b} from '../utils';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';

import controlMenuButtonIcon from '../../../../assets/icons/control-menu-button.svg';

// TODO: remove temporary fix for expand button
const NotIcon = fakeDisplayName('NotIcon', Icon);

export const CollapseButton = () => {
    const {onChangeCompact, compact, expandTitle, collapseTitle} = useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        onChangeCompact?.(!compact);
    }, [compact, onChangeCompact]);

    const buttonTitle = compact
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');
    return (
        <Button
            className={b('collapse-button', {compact})}
            view="flat"
            onClick={onCollapseButtonClick}
            title={buttonTitle}
        >
            <NotIcon
                data={controlMenuButtonIcon}
                className={b('collapse-icon')}
                width="16"
                height="10"
            />
        </Button>
    );
};
