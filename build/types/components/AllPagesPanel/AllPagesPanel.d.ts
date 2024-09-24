import { default as React } from 'react';
interface AllPagesPanelProps {
    className?: string;
    startEditIcon?: React.ReactNode;
    onEditModeChanged?: (isEditMode: boolean) => void;
}
export declare const AllPagesPanel: React.FC<AllPagesPanelProps>;
export {};
