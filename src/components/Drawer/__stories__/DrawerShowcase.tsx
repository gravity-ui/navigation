import React from 'react';

import {Button, RadioButton} from '@gravity-ui/uikit';

import {cn} from '../../utils/cn';
import {Drawer, DrawerItem, DrawerItemProps} from '../Drawer';

import './DrawerShowcase.scss';

const b = cn('drawer-showcase');

export function DrawerShowcase() {
    const [visible1, setVisible1] = React.useState<boolean>(true);
    const [visible2, setVisible2] = React.useState<boolean>(false);

    const [direction, setDirection] = React.useState<string>('left');
    const [direction2, setDirection2] = React.useState<string>('left');

    const [keepMountedGlobal, setKeepMountedGlobal] = React.useState<boolean>(false);
    const [keepMounted1, setKeepMounted1] = React.useState<boolean>(false);

    const hideAll = React.useCallback(() => {
        setVisible1(false);
        setVisible2(false);
    }, []);

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" size="l" onClick={() => setVisible1(!visible1)}>
                    {visible1 ? 'Hide 1' : 'Show 1'}
                </Button>
                &nbsp;&nbsp;
                <Button view="action" size="l" onClick={() => setVisible2(!visible2)}>
                    {visible2 ? 'Hide 2' : 'Show 2'}
                </Button>
                &nbsp;&nbsp; Direction: &nbsp;
                <RadioButton value={direction} onUpdate={setDirection}>
                    <RadioButton.Option value="left">left</RadioButton.Option>
                    <RadioButton.Option value="right">right</RadioButton.Option>
                </RadioButton>
                &nbsp;&nbsp; Direction2: &nbsp;
                <RadioButton value={direction2} onUpdate={setDirection2}>
                    <RadioButton.Option value="left">left</RadioButton.Option>
                    <RadioButton.Option value="right">right</RadioButton.Option>
                </RadioButton>
                <br /> Keep Mounted Drawer: &nbsp;
                <Button
                    view="action"
                    size="l"
                    onClick={() => setKeepMountedGlobal(!keepMountedGlobal)}
                >
                    {keepMountedGlobal ? 'On' : 'Off'}
                </Button>
                &nbsp;&nbsp; Keep Mounted 1: &nbsp;
                <Button
                    disabled={!keepMountedGlobal}
                    view="action"
                    size="l"
                    onClick={() => setKeepMounted1(!keepMounted1)}
                >
                    {keepMounted1 ? 'On' : 'Off'}
                </Button>
            </div>
            <Drawer
                className={b('drawer')}
                onVeilClick={hideAll}
                onEscape={hideAll}
                keepMounted={keepMountedGlobal}
            >
                <DrawerItem
                    keepMounted={keepMounted1}
                    visible={visible1}
                    id="item-1"
                    className={b('item-1')}
                    content=""
                    direction={direction as DrawerItemProps['direction']}
                />
                <DrawerItem
                    visible={visible2}
                    id="item-2"
                    className={b('item-2')}
                    content=""
                    direction={direction2 as DrawerItemProps['direction']}
                />
            </Drawer>
        </div>
    );
}
