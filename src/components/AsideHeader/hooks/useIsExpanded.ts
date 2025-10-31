import {useEffect, useState} from 'react';

export const useIsExpanded = (
    externalCompact: boolean,
    _onChangeCompact?: (compact: boolean) => void,
): [boolean, (isExpanded: boolean) => void] => {
    const [isExpanded, setIsExpanded] = useState(!externalCompact);

    useEffect(() => {
        setIsExpanded(!externalCompact);
    }, [externalCompact]);

    return [isExpanded, setIsExpanded];
};
