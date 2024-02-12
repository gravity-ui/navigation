import React from 'react';

import {Button, Hotkey} from '@gravity-ui/uikit';

import {HotkeysPanel} from '../../../components/HotkeysPanel';
import {cn} from '../../utils/cn';

import {hotkeys} from './moc';

import './HotkeysPanelShowcase.scss';

const b = cn('hotkeys-panel-showcase');

export function HotkeysPanelShowcase() {
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
                title={
                    <span className={b('title')}>
                        Hotkeys
                        <Hotkey value="shift+K" />
                    </span>
                }
                filterPlaceholder="Search"
                emptyState={<div className={b('empty')}>No hotkeys found</div>}
            />
        </div>
    );
}
