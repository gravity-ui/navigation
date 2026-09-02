/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import type {PopupProps} from '@gravity-ui/uikit';
import {render} from '@testing-library/react';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

import {MultipleTooltip} from '../MultipleTooltip';

const mockPopup = jest.fn<void, [PopupProps]>();

jest.mock('@gravity-ui/uikit', () => ({
    Popup: (props: PopupProps) => {
        mockPopup(props);

        return <>{props.children}</>;
    },
}));

describe('MultipleTooltip', () => {
    it('does not request focus return when it closes', () => {
        const anchorRef = {current: document.createElement('div')};
        const items: AsideHeaderItem[] = [{id: 'item', title: 'Item', icon: Gear}];

        render(
            <MultipleTooltip
                open
                anchorRef={anchorRef}
                placement={['right-start']}
                items={items}
            />,
        );

        expect(mockPopup).toHaveBeenCalledWith(expect.objectContaining({returnFocus: false}));
    });
});
