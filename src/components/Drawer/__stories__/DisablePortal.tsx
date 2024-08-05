import React from 'react';

import {Button, Checkbox, RadioButton} from '@gravity-ui/uikit';

import {cn} from '../../utils/cn';
import {Drawer, DrawerItem} from '../Drawer';

import {PlaceholderText} from './moc';

import './DisablePortal.scss';

const b = cn('disable-portal');

export function DisablePortalShowcase() {
    const [visible, setVisible] = React.useState(true);
    const [direction, setDirection] = React.useState<'left' | 'right'>('right');
    const [disablePortal, setDisablePortal] = React.useState(true);

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" onClick={() => setVisible((v) => !v)}>
                    {visible ? 'Hide' : 'Show'}
                </Button>
                <RadioButton
                    value={direction}
                    options={[
                        {value: 'left', content: 'Left'},
                        {value: 'right', content: 'Right'},
                    ]}
                    onUpdate={setDirection}
                />
                <Checkbox
                    content="Disable protal"
                    checked={disablePortal}
                    onUpdate={(v) => setDisablePortal(v)}
                />
            </div>
            <div className={b('container')}>
                <p>Container area for drawer with disablePortal</p>
                <Drawer
                    className={b('drawer')}
                    disablePortal={disablePortal}
                    onVeilClick={() => setVisible(false)}
                >
                    <DrawerItem
                        id="item"
                        direction={direction}
                        className={b('item')}
                        visible={visible}
                    >
                        <div className={b('item-content')} tabIndex={0}>
                            <PlaceholderText />
                        </div>
                    </DrawerItem>
                </Drawer>
            </div>
        </div>
    );
}
