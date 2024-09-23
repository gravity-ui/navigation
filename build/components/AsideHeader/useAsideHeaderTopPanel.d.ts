import { default as React } from 'react';
import { AsideHeaderTopAlertProps } from '../types';
type AsideHeaderTopPanel = {
    topRef: React.RefObject<HTMLDivElement>;
    updateTopSize: () => void;
};
export declare const useAsideHeaderTopPanel: ({ topAlert, }: {
    topAlert?: AsideHeaderTopAlertProps | undefined;
}) => AsideHeaderTopPanel;
export {};
