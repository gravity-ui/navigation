import React, {useReducer} from 'react';
import block from 'bem-cn-lite';

import {Settings} from '../index';
import {HelpPopover, Switch, Checkbox, RadioButton, Radio, Select} from '@gravity-ui/uikit';

import featureIcon from '../../../../assets/icons/gear.svg';

import './SettingsDemo.scss';

export interface DemoProps {
    title: string;
}

export interface DemoRowProps {
    title: string;
}

const b = block('settings-demo');

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
    ({initialPage, withBadge}: {initialPage?: string; withBadge?: boolean}) => {
        const [settings, dispatch] = useReducer(reducer, defaultSettings);
        const handleChange = (name: string, value: any) => {
            dispatch(setSetting(name, value));
        };
        return (
            <Settings
                initialPage={initialPage}
                onPageChange={(page) => {
                    console.log({page});
                }}
            >
                <Settings.Group id="arcanum" groupTitle="Arcanum">
                    <Settings.Page id="features" title="Features" icon={{data: featureIcon}}>
                        <Settings.Section title="Beta functionality">
                            <Settings.Item title="YFM markdown in md. files">
                                <Switch
                                    checked={settings.yfmMarkdown}
                                    onChange={() => {
                                        handleChange('yfmMarkdown', !settings.yfmMarkdown);
                                    }}
                                />
                            </Settings.Item>
                            <Settings.Item title="Lazy diff">
                                <Switch
                                    checked={settings.lazyDiff}
                                    onChange={() => {
                                        handleChange('lazyDiff', !settings.lazyDiff);
                                    }}
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
                                >
                                    <Radio value="arc">{'Arc'}</Radio>
                                    <Radio value="svn">{'SVN'}</Radio>
                                </RadioButton>
                            </Settings.Item>
                            <Settings.Item title="Start from dashboard page" withBadge={withBadge}>
                                <Switch
                                    checked={settings.startFromDashboardPage}
                                    onChange={() => {
                                        handleChange(
                                            'startFromDashboardPage',
                                            !settings.startFromDashboardPage,
                                        );
                                    }}
                                />
                            </Settings.Item>
                        </Settings.Section>
                    </Settings.Page>
                    <Settings.Page id="appearance" title="Appearance" icon={{data: featureIcon}}>
                        <Settings.Section
                            title="Appearance"
                            header={
                                <div className={b('appearance-header')}>
                                    These settings affect the appearance{' '}
                                </div>
                            }
                        >
                            <Settings.Item
                                title="Theme"
                                renderTitleComponent={(highlightedTitle) => (
                                    <div>
                                        <span>{highlightedTitle || 'Theme'}</span>
                                        <HelpPopover content="Change the look and feel of your application" />
                                    </div>
                                )}
                            >
                                <RadioButton
                                    value={settings.arcanumTheme ?? 'light'}
                                    onChange={(event) => {
                                        handleChange('arcanumTheme', event.target.value);
                                    }}
                                >
                                    <Radio value="light">{'Light'}</Radio>
                                    <Radio value="dark">{'Dark'}</Radio>
                                    <Radio value="special">{'Special'}</Radio>
                                    <Radio value="general">{'Inherit from General'}</Radio>
                                </RadioButton>
                            </Settings.Item>
                            <Settings.Item title="Code theme">
                                <Select
                                    value={settings.codeTheme ?? 'default'}
                                    options={[{value: 'default', content: 'Default'}]}
                                    onUpdate={(val) => {
                                        handleChange(
                                            'codeTheme',
                                            Array.isArray(val) ? val[0] : val,
                                        );
                                    }}
                                />
                            </Settings.Item>
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
            <SettingsComponent withBadge />
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
            <Settings.Page id="appearance" title="Appearance" icon={{data: featureIcon}}>
                <Settings.Section title="Appearance">
                    <Settings.Item title="Interface language">
                        <RadioButton
                            value={settings.lang ?? 'ru'}
                            onChange={(event) => {
                                handleChange('lang', event.target.value);
                            }}
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
                        >
                            <Radio value="light">{'Light'}</Radio>
                            <Radio value="dark">{'Dark'}</Radio>
                        </RadioButton>
                    </Settings.Item>
                </Settings.Section>
            </Settings.Page>
            <Settings.Page id="communication" title="Communication" icon={{data: featureIcon}}>
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
