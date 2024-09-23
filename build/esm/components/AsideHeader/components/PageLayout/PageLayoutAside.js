import React__default from 'react';
import { FirstPanel } from '../FirstPanel.js';
import '@gravity-ui/uikit';
import '../../../../node_modules/lodash/_root.js';
import '../../../../node_modules/lodash/_baseGetTag.js';
import '../../utils.js';
import { useAsideHeaderContext, AsideHeaderInnerContextProvider } from '../../AsideHeaderContext.js';
import { useAsideHeaderInnerContextValue } from '../../useAsideHeaderInnerContextValue.js';

const PageLayoutAside = React__default.forwardRef((props, ref) => {
    const { size, compact } = useAsideHeaderContext();
    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue(Object.assign({ size, compact }, props));
    return (React__default.createElement(AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue },
        React__default.createElement(FirstPanel, { ref: ref })));
});
PageLayoutAside.displayName = 'PageLayoutAside';

export { PageLayoutAside };
//# sourceMappingURL=PageLayoutAside.js.map
