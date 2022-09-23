import React from 'react';
import block from 'bem-cn-lite';
import {Icon, Popup, PopupPlacement, PopupProps} from '@gravity-ui/uikit';

import {ItemTooltip} from '../ItemTooltip/ItemTooltip';
import {ASIDE_HEADER_ICON_SIZE} from '../constants';

import settingsIcon from '../../../assets/icons/settings.svg';

import './FooterItem.scss';

const b = block('footer-item');

export const defaultAsideHeaderFooterPopupPlacement: PopupPlacement = ['right-end'];
export const defaultAsideHeaderFooterPopupOffset: NonNullable<PopupProps['offset']> = [-20, 8];

export interface FooterItemProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    compact: boolean;
    current?: boolean;
    text: React.ReactNode;
    tooltipText?: React.ReactNode;
    enableTooltip?: boolean;
    icon?: SVGIconData;
    iconSize?: string | number;
    className?: string;
    popupVisible?: boolean;
    popupAnchor?: React.RefObject<HTMLElement>;
    popupPlacement?: PopupPlacement;
    popupOffset?: PopupProps['offset'];
    renderPopupContent?: () => React.ReactNode;
    onClosePopup?: () => void;
    renderCustomIcon?: () => React.ReactNode;
}

export const FooterItem: React.FC<FooterItemProps> = ({
    onClick,
    compact,
    current = false,
    enableTooltip = true,
    tooltipText,
    text,
    icon,
    iconSize = ASIDE_HEADER_ICON_SIZE,
    className,
    popupAnchor,
    popupVisible = false,
    popupPlacement = defaultAsideHeaderFooterPopupPlacement,
    popupOffset = defaultAsideHeaderFooterPopupOffset,
    onClosePopup,
    renderPopupContent,
    renderCustomIcon,
}) => {
    const [tooltipAnchor, setTooltipAnchor] = React.useState<HTMLDivElement | null>(null);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!compact) {
            setTooltipAnchor(null);
        }
    }, [compact]);

    const iconData: SVGIconData = icon || settingsIcon;
    let iconPlaceNode: React.ReactNode;

    if (typeof renderCustomIcon === 'function') {
        iconPlaceNode = renderCustomIcon();
    } else {
        iconPlaceNode = compact ? (
            <React.Fragment>
                <div
                    onMouseEnter={(event) => setTooltipAnchor(event.currentTarget)}
                    onMouseLeave={() => setTooltipAnchor(null)}
                    className={b('btn-icon', {current})}
                >
                    <Icon data={iconData} size={iconSize} className={b('icon')} />
                </div>
                {/*TODO: custom popupOffset*/}
                {enableTooltip && <ItemTooltip anchor={tooltipAnchor} text={tooltipText || text} />}
            </React.Fragment>
        ) : (
            <div className={b('icon-wrap')}>
                <Icon data={iconData} size={iconSize} className={b('icon')} />
            </div>
        );
    }

    const anchorRef = popupAnchor || ref;

    const onClose = React.useCallback(
        (event: MouseEvent | KeyboardEvent) => {
            if (
                event instanceof MouseEvent &&
                event.target &&
                ref.current?.contains(event.target as Node)
            ) {
                return;
            }
            onClosePopup?.();
        },
        [onClosePopup],
    );

    return (
        <React.Fragment>
            <div className={b({compact, current}, className)} onClick={onClick} ref={ref}>
                <div className={b('icon-place')}>{iconPlaceNode}</div>
                {!compact && <div className={b('text')}>{text}</div>}
            </div>
            <Popup
                className={b('popup')}
                open={popupVisible}
                placement={popupPlacement}
                offset={popupOffset}
                anchorRef={anchorRef}
                onClose={onClose}
            >
                {renderPopupContent?.()}
            </Popup>
        </React.Fragment>
    );
};
