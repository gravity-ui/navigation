import React from 'react';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {createBlock} from '../../../../utils/cn';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

export function renderItemTitle(params: Pick<AsideHeaderItem, 'title' | 'rightAdornment'>) {
    let titleNode = <div className={b('title-text')}>{params.title}</div>;

    if (params.rightAdornment) {
        titleNode = (
            <React.Fragment>
                {titleNode}
                <div className={b('title-adornment')}>{params.rightAdornment}</div>
            </React.Fragment>
        );
    }

    return titleNode;
}
