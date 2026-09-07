import {createBlock} from '../utils/cn';

import styles from './AsideHeader.module.scss';

export const b = createBlock('aside-header', styles);

export const getCompactTransitionClassName = (enabled = true) =>
    b('compact-transition', {disabled: enabled === false});
