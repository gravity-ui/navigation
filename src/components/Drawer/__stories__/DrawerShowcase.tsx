import React from 'react';
import block from 'bem-cn-lite';
import {Button} from '@gravity-ui/uikit';

import {Drawer, DrawerItem} from '../Drawer';

import './DrawerShowcase.scss';

const b = block('drawer-showcase');

export function DrawerShowcase() {
    const [visible1, setVisible1] = React.useState<boolean>(true);
    const [visible2, setVisible2] = React.useState<boolean>(false);

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
            </div>
            <Drawer className={b('drawer')} onVeilClick={hideAll} onEscape={hideAll}>
                <DrawerItem visible={visible1} className={b('item-1')} />
                <DrawerItem visible={visible2} className={b('item-2')} />
            </Drawer>
        </div>
    );
}
