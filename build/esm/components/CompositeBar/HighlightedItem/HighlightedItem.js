import React__default, { useState, useMemo, useCallback, useEffect } from 'react';
import { Portal } from '@gravity-ui/uikit';
import debounce_1 from '../../../node_modules/lodash/debounce.js';
import { useAsideHeaderInnerContext } from '../../AsideHeader/AsideHeaderContext.js';
import { block } from '../../utils/cn.js';

const b = block('composite-bar-highlighted-item');
const DEBOUNCE_TIME = 200;
const HighlightedItem = ({ iconRef, iconNode, onClick, onClickCapture, }) => {
    const { openModalSubscriber } = useAsideHeaderInnerContext();
    const [{ top, left, width, height }, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleResizeDebounced = useMemo(() => debounce_1(() => {
        var _a;
        const { top = 0, left = 0, width = 0, height = 0, } = ((_a = iconRef === null || iconRef === void 0 ? void 0 : iconRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || {};
        setPosition({
            top: top + window.scrollY,
            left: left + window.scrollX,
            width,
            height,
        });
    }, DEBOUNCE_TIME, { leading: true }), [iconRef]);
    const handleResize = useCallback(() => handleResizeDebounced(), [handleResizeDebounced]);
    useEffect(() => {
        if (!isModalOpen) {
            return;
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize, isModalOpen]);
    openModalSubscriber === null || openModalSubscriber === void 0 ? void 0 : openModalSubscriber((open) => {
        setIsModalOpen(open);
    });
    if (!iconNode || !isModalOpen) {
        return null;
    }
    return (React__default.createElement(Portal, null,
        React__default.createElement("div", { className: b(), style: { left, top, width, height }, onClick: onClick, onClickCapture: onClickCapture, "data-toast": true },
            React__default.createElement("div", { className: b('icon') }, iconNode))));
};
HighlightedItem.displayName = 'HighlightedItem';

export { HighlightedItem };
//# sourceMappingURL=HighlightedItem.js.map
