import React from 'react';

import {Title} from '../../Title';
import {SettingsSelectionProviderContextValue} from '../Selection/context';
import {isSectionSelected} from '../Selection/utils';
import {SettingsSection} from '../SettingsSection';
import {b} from '../b';
import {SettingsMenu as CollectSettingsSettingsMenu, SettingsPage} from '../collect-settings';
import {SettingsContentProps} from '../types';

import {getPageTitleById} from './getPageTitleById';

type Props = {
    menu: CollectSettingsSettingsMenu;
    pages: Record<string, SettingsPage>;
    page: string | undefined;
    isMobile: boolean;
    search: string;
    selected: SettingsSelectionProviderContextValue;
} & Pick<SettingsContentProps, 'renderNotFound' | 'emptyPlaceholder' | 'onClose'>;

export const SettingsPageComponent = ({
    menu,
    pages,
    selected,
    isMobile,
    search,
    page,
    renderNotFound,
    emptyPlaceholder,
    onClose,
}: Props): React.ReactElement => {
    if (!page) {
        return typeof renderNotFound === 'function' ? (
            <>{renderNotFound()}</>
        ) : (
            <div className={b('not-found')}>{emptyPlaceholder}</div>
        );
    }

    const filteredSections = pages[page].sections.filter((section) => !section.hidden);

    return (
        <React.Fragment>
            {!isMobile && (
                <Title hasSeparator onClose={onClose}>
                    {getPageTitleById(menu, page)}
                </Title>
            )}

            <div className={b('content')}>
                {filteredSections.map((section) => {
                    const isSelected = isSectionSelected(selected, page, section);

                    return (
                        <SettingsSection
                            isSelected={isSelected}
                            isMobile={isMobile}
                            search={search}
                            {...section}
                            key={section.title}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};
