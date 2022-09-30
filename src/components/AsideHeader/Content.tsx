/* Used by renderContent AsideHeader prop */

import React from 'react';

export type RenderContentType = (data: {size: number}) => React.ReactNode;

interface ContentProps {
    renderContent?: RenderContentType;
    className?: string;
    size: number;
}

interface RenderContentProps {
    renderContent: RenderContentType;
    size: number;
}

const RenderContent: React.FC<RenderContentProps> = React.memo(({renderContent, size}) => {
    return <React.Fragment>{renderContent({size})}</React.Fragment>;
});

RenderContent.displayName = 'RenderContent';

export const Content: React.FC<ContentProps> = ({size, className, renderContent}) => {
    return (
        <div
            className={className}
            style={{...({'--aside-header-size': `${size}px`} as React.CSSProperties)}}
        >
            {typeof renderContent === 'function' && (
                <RenderContent size={size} renderContent={renderContent} />
            )}
        </div>
    );
};
