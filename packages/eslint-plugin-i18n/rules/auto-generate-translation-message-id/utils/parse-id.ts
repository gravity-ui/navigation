import {ID_SEPARATOR, TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR} from '../constants';

export interface ParsedId {
    namespace: string;
    key: string;
    uuid: string;
    raw: string;
}

/**
 * Parses an i18n ID into its components
 * Format: key:uuid or namespace.key:uuid or namespace.sub-namespace.key:uuid
 * Examples:
 *   "create:5251Z" (no namespace)
 *   "issue.field_description:9ntzU"
 *   "audit-trails.Trail.create:5251Z"
 */
export const parseId = (id: string): ParsedId | null => {
    if (!id || typeof id !== 'string') {
        return null;
    }

    // First, split by ':' to separate uuid
    const colonIndex = id.lastIndexOf(TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR);
    if (colonIndex === -1) {
        return null;
    }

    const uuid = id.substring(colonIndex + 1);
    const namespaceAndKey = id.substring(0, colonIndex);

    if (!uuid || !namespaceAndKey) {
        return null;
    }

    // Now split by '.' to get namespace and key parts
    // The key is the last part after the last dot
    const lastDotIndex = namespaceAndKey.lastIndexOf(ID_SEPARATOR);

    // If no dot found, the entire string is the key (no namespace)
    if (lastDotIndex === -1) {
        return {
            namespace: '',
            key: namespaceAndKey,
            uuid,
            raw: id,
        };
    }

    const namespace = namespaceAndKey.substring(0, lastDotIndex);
    const key = namespaceAndKey.substring(lastDotIndex + 1);

    if (!key) {
        return null;
    }

    return {
        namespace,
        key, // Keep as-is from the ID (already sanitized)
        uuid,
        raw: id,
    };
};
