import React__default from 'react';
import { block } from '../../utils/cn.js';

const b = block('mobile-header-burger');
const Burger = React__default.memo(({ closeTitle, openTitle, opened, className, onClick }) => (React__default.createElement("button", { className: b({ opened }, className), onClick: onClick, "aria-label": opened ? closeTitle : openTitle },
    React__default.createElement("span", { className: b('icon') },
        React__default.createElement("span", { className: b('icon-dash') })))));
Burger.displayName = 'Burger';

export { Burger };
//# sourceMappingURL=Burger.js.map
