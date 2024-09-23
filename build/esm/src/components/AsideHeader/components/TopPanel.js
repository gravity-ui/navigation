import React__default from 'react';
import { Alert } from '@gravity-ui/uikit';
import { useAsideHeaderTopPanel } from '../useAsideHeaderTopPanel.js';
import { b } from '../utils.js';

const TopPanel = ({ topAlert }) => {
    const { topRef, updateTopSize } = useAsideHeaderTopPanel({ topAlert });
    const [opened, setOpened] = React__default.useState(true);
    const handleClose = React__default.useCallback(() => {
        var _a;
        setOpened(false);
        (_a = topAlert === null || topAlert === void 0 ? void 0 : topAlert.onCloseTopAlert) === null || _a === void 0 ? void 0 : _a.call(topAlert);
    }, [topAlert]);
    React__default.useEffect(() => {
        if (!opened) {
            updateTopSize();
        }
    }, [opened, updateTopSize]);
    if (!topAlert || !topAlert.message) {
        return null;
    }
    return (React__default.createElement("div", { ref: topRef, className: b('pane-top', { opened }) }, opened && (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(Alert, { className: b('pane-top-alert', {
                centered: topAlert.centered,
                dense: topAlert.dense,
            }), corners: "square", layout: "horizontal", theme: topAlert.theme || 'warning', view: topAlert.view, icon: topAlert.icon, title: topAlert.title, message: topAlert.message, actions: topAlert.actions, onClose: topAlert.closable ? handleClose : undefined }),
        React__default.createElement("div", { className: b('pane-top-divider') })))));
};

export { TopPanel };
//# sourceMappingURL=TopPanel.js.map
