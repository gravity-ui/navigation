import React from 'react';

import {Button} from '@gravity-ui/uikit';

import {HotkeysGroup, HotkeysPanel, HotkeysPanelProps} from '../../../components/HotkeysPanel';
import {cn} from '../../utils/cn';

import {hotkeys} from './moc';

import './HotkeysPanelShowcase.scss';

const b = cn('hotkeys-panel-showcase');

type HotkeysPanelShowcaseProps = Pick<HotkeysPanelProps<HotkeysGroup>, 'filterable' | 'platform'>;

export function HotkeysPanelShowcase({filterable, platform}: HotkeysPanelShowcaseProps) {
    const [open, setOpen] = React.useState<boolean>(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={b()}>
            <div className={b('header')}>
                <Button view="action" size="l" onClick={() => setOpen(!open)}>
                    {open ? 'Hide hotkeys' : 'Show hotkeys'}
                </Button>
            </div>
            <div className={b('body')} />
            <HotkeysPanel
                hotkeys={hotkeys}
                open={open}
                onClose={handleClose}
                topOffset={77}
                title="Hotkeys"
                togglePanelHotkey="shift+K"
                filterable={filterable}
                filterPlaceholder="Search"
                emptyState={<div className={b('empty')}>No hotkeys found</div>}
                platform={platform}
            />
        </div>
    );
}
