import React from 'react';
import { LogoProps } from '../types';
import './MobileLogo.scss';
export interface MobileLogoProps extends LogoProps {
    compact: boolean;
}
export declare const MobileLogo: React.FC<MobileLogoProps>;
