import React from 'react';

import {Button, Checkbox, RadioButton} from '@gravity-ui/uikit';

import {cn} from '../../utils/cn';
import {Drawer, DrawerItem} from '../Drawer';
import {DrawerDirection} from '../utils';

import {PlaceholderText} from './moc';

import './DisablePortal.scss';

const b = cn('disable-portal');

export function DisablePortalShowcase() {
    const [visible, setVisible] = React.useState(true);
    const [direction, setDirection] = React.useState<DrawerDirection>('right');
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
                        {value: 'top', content: 'Top'},
                        {value: 'bottom', content: 'Bottom'},
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
                        className={b('item', {vertical: ['top', 'bottom'].includes(direction)})}
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
