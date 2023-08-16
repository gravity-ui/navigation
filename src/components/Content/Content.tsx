/* Used by renderContent AsideHeader prop */

import React from 'react';

export type RenderContentType = (data: {size: number}) => React.ReactNode;

interface ContentProps {
    size: number;
    className?: string;
    cssSizeVariableName?: string;
    renderContent?: RenderContentType;
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
    cssSizeVariableName = '--aside-header-size',
    renderContent,
}) => {
    return (
        <div
            className={className}
            style={{...({[cssSizeVariableName]: `${size}px`} as React.CSSProperties)}}
        >
            {typeof renderContent === 'function' && (
                <RenderContent size={size} renderContent={renderContent} />
            )}
        </div>
    );
};
