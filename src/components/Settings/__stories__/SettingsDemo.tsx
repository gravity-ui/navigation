import React, {useReducer} from 'react';

import {Gear} from '@gravity-ui/icons';
import {
    Button,
    Checkbox,
    HelpMark,
    Radio,
    SegmentedRadioGroup,
    Select,
    Switch,
    useUniqId,
} from '@gravity-ui/uikit';

import {cn} from '../../utils/cn';
import {SettingsSelection} from '../Selection/types';
import {Settings} from '../index';

import './SettingsDemo.scss';

export interface DemoProps {
    title: string;
}

export interface DemoRowProps {
    title: string;
}

const b = cn('settings-demo');

function setSetting(name: string, value: any) {
    return {
        type: 'set',
        payload: {[name]: value},
    };
}

type Action = ReturnType<typeof setSetting>;

function reducer(state: Record<string, any>, action: Action) {
    switch (action.type) {
        case 'set': {
            return {
                ...state,
                ...action.payload,
            };
        }
        default: {
            return state;
        }
    }
}

const defaultSettings = {
    vcs: 'arc',
};

export const SettingsComponent = React.memo(
    ({
        initialPage,
        withBadge,
        onClose,
    }: {
        initialPage?: string;
        withBadge?: boolean;
        onClose: () => void;
    }) => {
        const [settings, dispatch] = useReducer(reducer, defaultSettings);
        const handleChange = (name: string, value: any) => {
            dispatch(setSetting(name, value));
        };

        const [selection, setSelection] = React.useState<SettingsSelection | undefined>(undefined);
        const yfmMarkdownInFilesLabelId = useUniqId();
        const lazyDiffFieldLabelId = useUniqId();
        const startFromDashboardFieldLabelId = useUniqId();

        return (
            <Settings
                initialPage={initialPage}
                onPageChange={(page) => {
                    console.log({page});
                    setSelection(undefined);
                }}
                onClose={onClose}
                renderRightAdornment={({title}) => (
                    <HelpMark
                        aria-label="mark"
                        popoverProps={{
                            'aria-label': 'Note',
                        }}
                    >
                        Some text for ${title}
                    </HelpMark>
                )}
                renderSectionRightAdornment={({title}) => (
                    <HelpMark
                        aria-label="mark"
                        popoverProps={{
                            'aria-label': 'Note',
                        }}
                    >
                        Some text for ${title}
                    </HelpMark>
                )}
                showRightAdornmentOnHover={true} // true by default
                selection={selection}
            >
                <Settings.Group id="arcanum" groupTitle="Arcanum">
                    <Settings.Page id="features" title="Features" icon={{data: Gear}}>
                        <Settings.Section title="Beta functionality">
                            <Settings.Item
                                title="YFM markdown in md. files"
                                labelId={yfmMarkdownInFilesLabelId}
                            >
                                <Switch
                                    checked={settings.yfmMarkdown}
                                    onChange={() => {
                                        handleChange('yfmMarkdown', !settings.yfmMarkdown);
                                    }}
                                    controlProps={{
                                        'aria-labelledby': yfmMarkdownInFilesLabelId,
                                    }}
                                />
                            </Settings.Item>
                            <Settings.Item title="Lazy diff" labelId={lazyDiffFieldLabelId}>
                                <Switch
                                    checked={settings.lazyDiff}
                                    onChange={() => {
                                        handleChange('lazyDiff', !settings.lazyDiff);
                                    }}
                                    controlProps={{
                                        'aria-labelledby': lazyDiffFieldLabelId,
                                    }}
                                />
                            </Settings.Item>
                            <Settings.Item title="Go to setting">
                                <button
                                    onClick={() =>
                                        setSelection({settingId: 'arcanum-theme-setting'})
                                    }
                                    aria-label="settings"
                                    className={b('item-button')}
                                >
                                    Go to «Arcanum/Appearance/Appearance/Theme»
                                </button>
                            </Settings.Item>
                            <Settings.Item title="Go to section">
                                <button
                                    onClick={() =>
                                        setSelection({section: {id: 'arcanum-common-section'}})
                                    }
                                    aria-label="settings"
                                    className={b('item-button')}
                                >
                                    Go to «Arcanum/Features/Common»
                                </button>
                            </Settings.Item>
                        </Settings.Section>
                        <Settings.Section
                            id={'arcanum-common-section'}
                            title="Common"
                            withBadge={withBadge}
                        >
                            <Settings.Item
                                title="Default VCS"
                                description={
                                    <div>
                                        <i>Description</i>
                                    </div>
                                }
                            >
                                <SegmentedRadioGroup
                                    value={settings.vcs}
                                    onChange={(event) => {
                                        handleChange('vcs', event.target.value);
                                    }}
                                >
                                    <Radio value="arc">{'Arc'}</Radio>
                                    <Radio value="svn">{'SVN'}</Radio>
                                </SegmentedRadioGroup>
                            </Settings.Item>
                            <Settings.Item
                                title="Start from dashboard page"
                                withBadge={withBadge}
                                labelId={startFromDashboardFieldLabelId}
                            >
                                <Switch
                                    checked={settings.startFromDashboardPage}
                                    onChange={() => {
                                        handleChange(
                                            'startFromDashboardPage',
                                            !settings.startFromDashboardPage,
                                        );
                                    }}
                                    controlProps={{
                                        'aria-labelledby': startFromDashboardFieldLabelId,
                                    }}
                                />
                            </Settings.Item>
                            <Settings.Item title="Full width" id="full-width" showTitle={false}>
                                Place to display full width content
                            </Settings.Item>
                        </Settings.Section>
                    </Settings.Page>
                    <Settings.Page id="appearance" title="Appearance" icon={{data: Gear}}>
                        <Settings.Section
                            title="Appearance"
                            header={
                                <div className={b('appearance-header')}>
                                    These settings affect the appearance{' '}
                                </div>
                            }
                        >
                            <Settings.Item
                                id="arcanum-theme-setting"
                                title="Theme"
                                renderTitleComponent={(highlightedTitle) => (
                                    <div>
                                        <span>{highlightedTitle || 'Theme'}</span>
                                    </div>
                                )}
                            >
                                <SegmentedRadioGroup
                                    value={settings.arcanumTheme ?? 'light'}
                                    onChange={(event) => {
                                        handleChange('arcanumTheme', event.target.value);
                                    }}
                                >
                                    <Radio value="light">{'Light'}</Radio>
                                    <Radio value="dark">{'Dark'}</Radio>
                                    <Radio value="special">{'Special'}</Radio>
                                    <Radio value="general">{'Inherit from General'}</Radio>
                                </SegmentedRadioGroup>
                            </Settings.Item>
                            <Settings.Item title="Code theme">
                                <Select
                                    value={settings.codeTheme ?? ['default']}
                                    options={[{value: 'default', content: 'Default'}]}
                                    onUpdate={(val) => {
                                        handleChange(
                                            'codeTheme',
                                            Array.isArray(val) ? val[0] : val,
                                        );
                                    }}
                                />
                            </Settings.Item>
                            {onClose && (
                                <Settings.Item
                                    title="Use triggerEvent method"
                                    withBadge={withBadge}
                                >
                                    <Button aria-label="close" onClick={() => onClose?.()}>
                                        Save and close
                                    </Button>
                                </Settings.Item>
                            )}
                        </Settings.Section>
                    </Settings.Page>
                </Settings.Group>
                {renderGeneralSettings(settings, handleChange, withBadge)}
            </Settings>
        );
    },
);

SettingsComponent.displayName = 'SettingsComponent';

export function SettingsDemo() {
    return (
        <div className={b()}>
            <div className={b('header')}>
                <h1>Settings</h1>
            </div>
            <SettingsComponent withBadge onClose={() => alert('Close settings')} />
        </div>
    );
}

function renderGeneralSettings(
    settings: Record<string, any>,
    handleChange: (name: string, value: any) => void,
    withBadge?: boolean,
) {
    return (
        <Settings.Group id="general" groupTitle="General">
            <Settings.Page id="appearance" title="Appearance" icon={{data: Gear}}>
                <Settings.Section title="Appearance">
                    <Settings.Item title="Interface language">
                        <SegmentedRadioGroup
                            value={settings.lang ?? 'ru'}
                            onChange={(event) => {
                                handleChange('lang', event.target.value);
                            }}
                        >
                            <Radio value="ru">{'Русский'}</Radio>
                            <Radio value="en">{'English'}</Radio>
                        </SegmentedRadioGroup>
                    </Settings.Item>
                    <Settings.Item title="Theme">
                        <SegmentedRadioGroup
                            value={settings.theme ?? 'light'}
                            onChange={(event) => {
                                handleChange('theme', event.target.value);
                            }}
                        >
                            <Radio value="light">{'Light'}</Radio>
                            <Radio value="dark">{'Dark'}</Radio>
                        </SegmentedRadioGroup>
                    </Settings.Item>
                </Settings.Section>
            </Settings.Page>
            <Settings.Page id="communication" title="Communication" icon={{data: Gear}}>
                <Settings.Section title="Phone settings" withBadge={withBadge}>
                    <Settings.Item
                        title="Send notifications"
                        align="top"
                        withBadge={withBadge}
                        description={'Alerts configured in Monitoring.'}
                    >
                        <div className={b('checkbox')}>
                            <Checkbox
                                content="Monitoring"
                                checked={settings.notificationMonitoring}
                                onChange={() => {
                                    handleChange(
                                        'notificationMonitoring',
                                        !settings.notificationMonitoring,
                                    );
                                }}
                            />
                            <div className={b('checkbox-description')}>
                                {'Alerts configured in Monitoring.'}
                            </div>
                        </div>
                        <div className={b('checkbox')}>
                            <Checkbox
                                content="Billing"
                                checked={settings.notificationBilling}
                                onChange={() => {
                                    handleChange(
                                        'notificationBilling',
                                        !settings.notificationBilling,
                                    );
                                }}
                            />
                            <div className={b('checkbox-description')}>
                                {
                                    'Urgent notifications related to your account and cloud status. And urgent notifications related to your account and cloud status.'
                                }
                            </div>
                        </div>
                    </Settings.Item>
                </Settings.Section>
            </Settings.Page>
        </Settings.Group>
    );
}
