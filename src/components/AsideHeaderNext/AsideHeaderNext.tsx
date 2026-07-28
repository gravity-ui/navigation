import {Alert} from './Alert';
import {Aside} from './Aside';
import {Background} from './Background';
import {CollapseButton} from './CollapseButton';
import {Content} from './Content';
import {Footer} from './Footer';
import {Item} from './Item';
import {Logo} from './Logo';
import {Menu} from './Menu';
import {Panel} from './Panel';
import {Root} from './Root';
import {Subheader} from './Subheader';

/**
 * Compound, base-ui-style rebuild of AsideHeader (prototype).
 *
 * Two layout modes via `Root`'s `layout` prop:
 * - `slots` (default): strict layout, JSX order of direct children is irrelevant.
 * - `manual`: free composition, you place parts yourself (wrap with `Aside`).
 */
export const AsideHeaderNext = Object.assign(Root, {
    Root,
    Aside,
    Alert,
    Background,
    Logo,
    Subheader,
    Menu,
    Item,
    Footer,
    CollapseButton,
    Content,
    Panel,
});
