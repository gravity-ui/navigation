import { __rest } from '../../../node_modules/tslib/tslib.es6.js';
import React__default from 'react';
import { PageLayout } from './components/PageLayout/PageLayout.js';
import { PageLayoutAside } from './components/PageLayout/PageLayoutAside.js';

const AsideHeader = React__default.forwardRef((_a, ref) => {
    var { compact, className, topAlert } = _a, props = __rest(_a, ["compact", "className", "topAlert"]);
    return (React__default.createElement(PageLayout, { compact: compact, className: className, topAlert: topAlert },
        React__default.createElement(PageLayoutAside, Object.assign({ ref: ref }, props)),
        React__default.createElement(PageLayout.Content, { renderContent: props.renderContent })));
});
AsideHeader.displayName = 'AsideHeader';

export { AsideHeader };
//# sourceMappingURL=AsideHeader.js.map
