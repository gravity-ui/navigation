import React from 'react';

import {cn} from '../../../utils/cn';
import type {FooterProps} from '../../types';
import {MobileFooter} from '../Footer';

import './MobileFooterShowcase.scss';

const b = cn('mobile-footer-showcase');

export function MobileFooterShowcase({className, ...footerProps}: FooterProps) {
    return (
        <div className={b({mobile: true})}>
            <div className={b('body')} />
            <MobileFooter className={b('footer', className)} {...footerProps} />
        </div>
    );
}
