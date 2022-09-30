import React from 'react';
import block from 'bem-cn-lite';

import {MenuItem, AsideHeaderDict, Dict} from '../types';

import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH, defaultDict} from '../constants';

import {Button, Icon} from '@gravity-ui/uikit';

import {Drawer, DrawerItem, DrawerItemProps} from '../Drawer/Drawer';
import {Logo, LogoProps as LogoComponentProps} from '../Logo/Logo';
import {CompositeBar} from '../CompositeBar/CompositeBar';
import {Content, RenderContentType} from './Content';

import controlMenuButtonIcon from '../../../assets/icons/control-menu-button.svg';
import headerDividerCollapsedIcon from '../../../assets/icons/divider-collapsed.svg';

import './AsideHeader.scss';

const b = block('aside-header');

type LogoProps = Omit<LogoComponentProps, 'compact'>;

interface AsideHeaderGeneralProps {
    logo: LogoProps;
    compact: boolean;
    dict?: AsideHeaderDict;
    className?: string;
    renderContent?: RenderContentType;
    renderFooter?: (data: {
        size: number;
        compact: boolean;
        asideRef: React.RefObject<HTMLDivElement>;
    }) => React.ReactNode;
    onClosePanel?: () => void;
    onChangeCompact?: (compact: boolean) => void;
}

interface AsideHeaderDefaultProps {
    panelItems: DrawerItemProps[];
    subheaderItems: MenuItem[];
    menuItems: MenuItem[];
}

export interface AsideHeaderProps
    extends AsideHeaderGeneralProps,
        Partial<AsideHeaderDefaultProps> {}

type AsideHeaderInnerProps = AsideHeaderGeneralProps & AsideHeaderDefaultProps;

interface AsideHeaderState {
    compact: boolean;
}

export class AsideHeader extends React.Component<AsideHeaderInnerProps, AsideHeaderState> {
    static defaultProps: AsideHeaderDefaultProps = {
        panelItems: [],
        subheaderItems: [],
        menuItems: [],
    };

    asideRef = React.createRef<HTMLDivElement>();

    constructor(props: AsideHeaderInnerProps) {
        super(props);

        this.state = {
            compact: Boolean(props.compact),
        };
    }

    componentDidUpdate(prevProps: AsideHeaderInnerProps) {
        if (prevProps.compact !== this.props.compact) {
            this.setState({compact: Boolean(this.props.compact)});
        }
    }

    render() {
        const {className} = this.props;
        const {compact} = this.state;

        const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;

        return (
            <div className={b({compact}, className)}>
                <div className={b('pane-container')}>
                    {this.renderFirstPane(size)}
                    {this.renderSecondPane(size)}
                </div>
            </div>
        );
    }

    private renderFirstPane = (size: number) => {
        const {dict, menuItems, panelItems} = this.props;
        const {compact} = this.state;

        return (
            <div>
                <div className={b('aside')} style={{width: size}}>
                    <div className={b('aside-popup-anchor')} ref={this.asideRef} />
                    <div className={b('aside-content')}>
                        {this.renderHeader()}
                        <CompositeBar
                            items={menuItems}
                            compact={compact}
                            enableCollapsing={true}
                            dict={dict}
                            onItemClick={this.onCompositeBarClick}
                        />
                        {this.renderFooter(size)}
                        {this.renderCollapseButton()}
                    </div>
                </div>

                {panelItems && this.renderPanels(size)}
            </div>
        );
    };

    private renderSecondPane = (size: number) => {
        return (
            <Content
                size={size}
                renderContent={this.props.renderContent}
                className={b('content')}
            />
        );
    };

    private renderLogo = () => <Logo {...this.props.logo} compact={this.props.compact} />;

    private renderHeader = () => (
        <div className={b('header')}>
            {this.renderLogo()}

            <CompositeBar
                items={this.props.subheaderItems}
                compact={this.props.compact}
                enableCollapsing={false}
            />

            <Icon
                data={headerDividerCollapsedIcon}
                className={b('header-divider')}
                width={ASIDE_HEADER_COMPACT_WIDTH}
                height="29"
            />
        </div>
    );

    private renderFooter = (size: number) => {
        const {compact} = this.state;

        return (
            <div className={b('footer')}>
                {this.props.renderFooter?.({
                    size,
                    compact,
                    asideRef: this.asideRef,
                })}
            </div>
        );
    };

    private renderPanels = (size: number) => {
        const {panelItems} = this.props;

        return (
            <Drawer
                className={b('panels')}
                onVeilClick={this.onCloseDrawer}
                onEscape={this.onCloseDrawer}
                style={{left: size}}
            >
                {panelItems.map((item) => (
                    <DrawerItem key={item.id} {...item} />
                ))}
            </Drawer>
        );
    };

    private renderCollapseButton = () => {
        const {compact, dict} = this.props;
        const typeButton = compact ? Dict.ExpandButton : Dict.CollapseButton;

        return (
            <Button
                className={b('collapse-button', {compact})}
                view="flat"
                onClick={this.onCollapseButtonClick}
                title={dict?.[typeButton] ?? defaultDict[typeButton]}
            >
                <Icon
                    data={controlMenuButtonIcon}
                    className={b('collapse-icon')}
                    width="16"
                    height="10"
                />
            </Button>
        );
    };

    private onCollapseButtonClick = () => {
        const newCompact = !this.state.compact;

        this.setState({compact: newCompact});

        this.props.onChangeCompact?.(newCompact);
    };

    private onCloseDrawer = () => {
        this.props.onClosePanel?.();
    };

    private onCompositeBarClick = () => {
        this.props.onClosePanel?.();
    };
}
