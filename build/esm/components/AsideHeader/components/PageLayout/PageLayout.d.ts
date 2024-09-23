import React, { PropsWithChildren } from 'react';
import { ContentProps } from '../../../Content';
import { LayoutProps } from '../../types';
import '../../AsideHeader.scss';
export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {
}
declare const PageLayout: (({ compact, className, children, topAlert }: PageLayoutProps) => React.JSX.Element) & {
    Content: React.FC<React.PropsWithChildren<Pick<ContentProps, "renderContent">>>;
};
export { PageLayout };
