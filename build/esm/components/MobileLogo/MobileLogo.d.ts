import { default as React } from 'react';
import { LogoProps } from '../types';
export interface MobileLogoProps extends LogoProps {
    compact: boolean;
}
export declare const MobileLogo: React.FC<MobileLogoProps>;
