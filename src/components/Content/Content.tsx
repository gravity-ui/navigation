/* Used by renderContent AsideHeader prop */

import React from 'react';

export type RenderContentType = (data: {size: number}) => React.ReactNode;

export interface ContentProps {
    size: number;
    className?: string;
    cssSizeVariableName?: string;
    renderContent?: RenderContentType;
    children?: React.ReactNode;
}

interface RenderContentProps {
    renderContent: RenderContentType;
    size: number;
}

const RenderContent: React.FC<RenderContentProps> = React.memo(({renderContent, size}) => {
    return <React.Fragment>{renderContent({size})}</React.Fragment>;
});

RenderContent.displayName = 'RenderContent';

export const Content: React.FC<ContentProps> = ({
    size, // TODO: move to context when MobileHeader will support it
    className,
    cssSizeVariableName = '--gn-aside-header-size',
    renderContent,
    children,
}) => {
    return (
        <div
            className={className}
            style={{...({[cssSizeVariableName]: `${size}px`} as React.CSSProperties)}}
        >
            {typeof renderContent === 'function' ? (
                <RenderContent size={size} renderContent={renderContent} />
            ) : (
                children
            )}
        </div>
    );
};
