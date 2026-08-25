import {Alert} from './Alert';
import {Aside} from './Aside';
import {Background} from './Background';
import {CollapseButton} from './CollapseButton';
import {Content} from './Content';
import {Divider} from './Divider';
import {GroupItem} from './GroupItem';
import {Item} from './Item';
import {ItemList} from './ItemList';
import {Logo} from './Logo';
import {Footer, Menu, Subheader} from './Menu';
import {Panel} from './Panel';
import {Popup} from './Popup';
import {Root} from './Root';
import {Row} from './Row';
import {WhenCompact, WhenExpanded} from './Visibility';

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
    // Row containers: Subheader / Menu / Footer are presets over ItemList.
    ItemList,
    Subheader,
    Menu,
    Footer,
    // Rows.
    Item,
    GroupItem,
    Divider,
    // Overlays — declared next to their trigger, content is portaled.
    Popup,
    Panel,
    // Layout primitives.
    Row,
    Content,
    CollapseButton,
    WhenCompact,
    WhenExpanded,
});
