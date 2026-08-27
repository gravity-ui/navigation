import React from 'react';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {createBlock} from '../../../../utils/cn';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

export function renderItemTitle(
    params: Pick<AsideHeaderItem, 'title' | 'rightAdornment' | 'titleLines'>,
) {
    // Preserve the pre-v7 two-line fallback. Consumers opt into the new
    // single-line presentation explicitly with `titleLines: 1`.
    const titleLines = params.titleLines ?? 2;
    let titleNode = (
        <div className={b('title-text', {lines: titleLines === 2 ? '2' : undefined})}>
            {params.title}
        </div>
    );

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
