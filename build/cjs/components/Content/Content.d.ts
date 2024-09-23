import React from 'react';
export type RenderContentType = (data: {
    size: number;
}) => React.ReactNode;
export interface ContentProps {
    size: number;
    className?: string;
    cssSizeVariableName?: string;
    renderContent?: RenderContentType;
    children?: React.ReactNode;
}
export declare const Content: React.FC<ContentProps>;
