import React from 'react';

import {Button} from '@gravity-ui/uikit';

import {HotkeysPanel} from '../../../components/HotkeysPanel';
import type {HotkeysGroup, HotkeysPanelProps} from '../../../components/HotkeysPanel';
import {cn} from '../../utils/cn';

import {hotkeys} from './moc';

import './HotkeysPanelShowcase.scss';

const b = cn('hotkeys-panel-showcase');

const emptyScreenProps: HotkeysPanelProps<{}>['emptyScreenProps'] = {
    title: 'Nothing found',
    description: 'Change the search terms or leave a request to add a new hotkey',
    actions: [
        {
            text: 'Request Hotkey',
        },
    ],
};

type HotkeysPanelShowcaseProps = Pick<HotkeysPanelProps<HotkeysGroup>, 'filterable'>;

export function HotkeysPanelShowcase({filterable}: HotkeysPanelShowcaseProps) {
    const [visible, setVisible] = React.useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" size="l" onClick={() => setVisible(!visible)}>
                    {visible ? 'Hide hotkeys' : 'Show hotkeys'}
                </Button>
            </div>
            <div className={b('body')} />
            <HotkeysPanel
                hotkeys={hotkeys}
                visible={visible}
                onClose={handleClose}
                topOffset={77}
                title="Hotkeys"
                togglePanelHotkey="shift+K"
                filterable={filterable}
                filterPlaceholder="Search"
                emptyScreenProps={emptyScreenProps}
            />
        </div>
    );
}
