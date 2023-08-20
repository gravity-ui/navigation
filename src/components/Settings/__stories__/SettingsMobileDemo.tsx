import React, {useReducer} from 'react';

import {Settings} from '../../..';
import {Switch, RadioButton, Button, Radio, Select} from '@gravity-ui/uikit';
import './SettingsMobileDemo.scss';
import {cn} from '../../utils/cn';

import featureIcon from '../../../../assets/icons/gear.svg';

const b = cn('settings-mobile-demo');

const SELECT_1_ITEMS = [
    {
        value: 'light',
        title: 'Light',
        key: 'select_1_elem_1',
    },
    {
        value: 'dark',
        title: 'Dark',
        key: 'select_1_elem_2',
    },
    {
        value: 'special',
        title: 'Special',
        key: 'select_1_elem_3',
    },
    {
        value: 'general',
        title: 'Inherit from General',
        key: 'select_1_elem_4',
    },
];

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

export const SettingsMobileComponent = React.memo(
    ({
        initialPage,
        withBadge,
        onClose,
    }: {
        initialPage?: string;
        withBadge?: boolean;
        onClose?: () => void;
    }) => {
        const [settings, dispatch] = useReducer(reducer, defaultSettings);
        const handleChange = (name: string, value: any) => {
            dispatch(setSetting(name, value));
        };
        return (
            <Settings
                view="mobile"
                initialPage={initialPage}
                onPageChange={(page) => {
                    console.log({page});
                }}
                onClose={onClose}
            >
                <Settings.Group id="arcanum" groupTitle="Arcanum">
                    <Settings.Page id="features" title="Features">
                        <Settings.Section title="Beta functionality">
                            <Settings.Item title="YFM markdown in md. files" mode="row">
                                <Switch
                                    checked={settings.yfmMarkdown}
                                    onChange={() => {
                                        handleChange('yfmMarkdown', !settings.yfmMarkdown);
                                    }}
                                    size="l"
                                />
                            </Settings.Item>
                            <Settings.Item title="Lazy diff" mode="row">
                                <Switch
                                    checked={settings.lazyDiff}
                                    onChange={() => {
                                        handleChange('lazyDiff', !settings.lazyDiff);
                                    }}
                                    size="l"
                                />
                            </Settings.Item>
                        </Settings.Section>
                        <Settings.Section title="Common" withBadge={withBadge}>
                            <Settings.Item title="Default VCS">
                                <RadioButton
                                    value={settings.vcs}
                                    onChange={(event) => {
                                        handleChange('vcs', event.target.value);
                                    }}
                                    size="xl"
                                >
                                    <Radio value="arc">{'Arc'}</Radio>
                                    <Radio value="svn">{'SVN'}</Radio>
                                </RadioButton>
                            </Settings.Item>
                            <Settings.Item
                                title="Start from dashboard page"
                                withBadge={withBadge}
                                mode="row"
                            >
                                <Switch
                                    checked={settings.startFromDashboardPage}
                                    onChange={() => {
                                        handleChange(
                                            'startFromDashboardPage',
                                            !settings.startFromDashboardPage,
                                        );
                                    }}
                                    size="l"
                                />
                            </Settings.Item>
                            {onClose && (
                                <Settings.Item title="Use triggerEvent method" mode="row">
                                    <Button onClick={() => onClose?.()} size="xl">
                                        Save and close
                                    </Button>
                                </Settings.Item>
                            )}
                        </Settings.Section>
                    </Settings.Page>
                    <Settings.Page id="appearance" title="Appearance">
                        <Settings.Section
                            title="Appearance"
                            header={<div>These settings affect the appearance </div>}
                            showTitle={false}
                        >
                            <Settings.Item
                                title="Theme"
                                renderTitleComponent={(highlightedTitle) => (
                                    <div>
                                        <span>{highlightedTitle || 'Theme'}</span>
                                    </div>
                                )}
                            >
                                <Select
                                    value={settings.arcanumTheme ?? 'light'}
                                    size="l"
                                    onUpdate={(value) => {
                                        handleChange('arcanumTheme', value);
                                    }}
                                    options={SELECT_1_ITEMS}
                                    placeholder={'Select value...'}
                                    className={b('select')}
                                />
                            </Settings.Item>
                            <Settings.Item title="Code theme">
                                <RadioButton
                                    value={settings.codeTheme ?? 'light'}
                                    onChange={(event) => {
                                        handleChange('codeTheme', event.target.value);
                                    }}
                                    size="xl"
                                >
                                    <Radio value="default">{'Default'}</Radio>
                                    <Radio value="exta">{'Extra'}</Radio>
                                </RadioButton>
                            </Settings.Item>
                        </Settings.Section>
                    </Settings.Page>
                </Settings.Group>
                {renderGeneralSettings(settings, handleChange, withBadge)}
            </Settings>
        );
    },
);

SettingsMobileComponent.displayName = 'SettingsMobileComponent';

export function SettingsMobileDemo() {
    return (
        <div className={b()}>
            <SettingsMobileComponent withBadge onClose={() => alert('Close settings')} />
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
            <Settings.Page id="appearance" title="General Appearance" icon={{data: featureIcon}}>
                <Settings.Section title="Appearance" showTitle={false}>
                    <Settings.Item title="Interface language">
                        <RadioButton
                            value={settings.lang ?? 'ru'}
                            onChange={(event) => {
                                handleChange('lang', event.target.value);
                            }}
                            size="xl"
                        >
                            <Radio value="ru">{'Русский'}</Radio>
                            <Radio value="en">{'English'}</Radio>
                        </RadioButton>
                    </Settings.Item>
                    <Settings.Item title="Theme">
                        <RadioButton
                            value={settings.theme ?? 'light'}
                            onChange={(event) => {
                                handleChange('theme', event.target.value);
                            }}
                            size="xl"
                        >
                            <Radio value="light">{'Light'}</Radio>
                            <Radio value="dark">{'Dark'}</Radio>
                        </RadioButton>
                    </Settings.Item>
                </Settings.Section>
            </Settings.Page>
            <Settings.Page id="communication" title="Communication" icon={{data: featureIcon}}>
                <Settings.Section title="Send notifications" withBadge={withBadge}>
                    <Settings.Item
                        title="Monitoring"
                        withBadge={withBadge}
                        align="top"
                        mode="row"
                        description={'Alerts configured in Monitoring.'}
                    >
                        <Switch
                            size="l"
                            checked={settings.notificationMonitoring}
                            onChange={() => {
                                handleChange(
                                    'notificationMonitoring',
                                    !settings.notificationMonitoring,
                                );
                            }}
                        />
                    </Settings.Item>
                    <Settings.Item
                        title="Billing"
                        withBadge={withBadge}
                        align="top"
                        mode="row"
                        description={
                            'Urgent notifications related to your account and cloud status. And urgent notifications related to your account and cloud status.'
                        }
                    >
                        <Switch
                            size="l"
                            checked={settings.notificationBilling}
                            onChange={() => {
                                handleChange('notificationBilling', !settings.notificationBilling);
                            }}
                        />
                    </Settings.Item>
                </Settings.Section>
            </Settings.Page>
        </Settings.Group>
    );
}
