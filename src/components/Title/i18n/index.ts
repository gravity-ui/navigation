import {addComponentKeysets} from '@gravity-ui/uikit/i18n';
import {NAMESPACE} from '../../utils/cn';

import en from './en.json';
import ru from './ru.json';

const COMPONENT = 'Title';
export default addComponentKeysets({en, ru}, `${NAMESPACE}${COMPONENT}`);
