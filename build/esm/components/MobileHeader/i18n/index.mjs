import { addComponentKeysets } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/utils/addComponentKeysets.mjs';
import { NAMESPACE } from '../../utils/cn.mjs';
import en from './en.json.mjs';
import ru from './ru.json.mjs';

const COMPONENT = "MobileHeader";
const i18n = addComponentKeysets({ en, ru }, `${NAMESPACE}${COMPONENT}`);

export { i18n as default };
//# sourceMappingURL=index.mjs.map
