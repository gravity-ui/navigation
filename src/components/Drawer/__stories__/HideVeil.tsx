import React from 'react';

import {Button, Checkbox} from '@gravity-ui/uikit';

import {cn} from '../../utils/cn';
import {Drawer, DrawerItem} from '../Drawer';

import {PlaceholderText} from './moc';

import './HideVeil.scss';

const b = cn('hide-veil');

export function HideVeilShowcase() {
    const [visible, setVisible] = React.useState(true);
    const [hideVeil, setHideVeil] = React.useState(true);

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" onClick={() => setVisible((v) => !v)}>
                    {visible ? 'Hide' : 'Show'}
                </Button>
                <Checkbox content="Hide veil" checked={hideVeil} onUpdate={setHideVeil} />
            </div>
            <div className={b('container')}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, quos!</p>
                <Drawer
                    className={b('drawer')}
                    hideVeil={hideVeil}
                    disablePortal
                    onVeilClick={() => setVisible(false)}
                >
                    <DrawerItem id="item" className={b('item')} direction="right" visible={visible}>
                        <div className={b('item-content')} tabIndex={0}>
                            <PlaceholderText />
                        </div>
                    </DrawerItem>
                </Drawer>
            </div>
        </div>
    );
}
