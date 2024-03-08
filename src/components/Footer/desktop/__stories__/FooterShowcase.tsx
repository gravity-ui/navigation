import React from 'react';

import {cn} from '../../../utils/cn';
import type {FooterProps} from '../../types';
import {Footer} from '../Footer';

import './FooterShowcase.scss';

const b = cn('footer-showcase');

export function FooterShowcase({className, ...footerProps}: FooterProps) {
    return (
        <div className={b()}>
            <div className={b('body')} />
            <Footer className={b('footer', className)} {...footerProps} />
        </div>
    );
}
