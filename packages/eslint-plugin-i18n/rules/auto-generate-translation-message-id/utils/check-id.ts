import shortUuid from 'short-uuid';

import {
    DEFAULT_INVALID_CHARS_PATTERN,
    DEFAULT_INVALID_CHARS_REPLACEMENT,
    DEFAULT_MAX_VALID_LENGTH,
} from '../constants';
import {CheckIdProps} from '../types/utils';

import {buildId} from './build-id';
import {checkGenerateId} from './check-generate-id';
import {defaultReportMaxValidLengthExceeded} from './default-reporters';
import {getNamespace} from './get-namespace';
import {parseId} from './parse-id';

export const checkId = ({
    reportLackId,
    reportMaxValidLengthExceeded = defaultReportMaxValidLengthExceeded,
    hasId,
    currentIdValue,
    translationObjectKey,
    generateId,
    namespaceMatchers,
    context,
    node,
    maxValidLength = DEFAULT_MAX_VALID_LENGTH,
    invalidCharsPattern = DEFAULT_INVALID_CHARS_PATTERN,
    invalidCharsReplacement = DEFAULT_INVALID_CHARS_REPLACEMENT,
    invalidCharsReplacer,
    validateId = false,
}: Omit<CheckIdProps, 'idName'>) => {
    const filename = context.getFilename();

    if (typeof generateId === 'function') {
        checkGenerateId({
            generateId,
            filename,
            currentIdValue,
            hasId,
            context,
            reportLackId,
            node,
        });

        return;
    }

    const namespace = getNamespace({
        filename,
        namespaceMatchers,
        invalidCharsPattern,
        invalidCharsReplacement,
        invalidCharsReplacer,
    });

    const uuid = shortUuid.generate().slice(0, 5);

    const id = buildId({uuid, namespace, translationObjectKey});

    // Check if generated ID exceeds max length
    if (id.length > maxValidLength) {
        reportMaxValidLengthExceeded({context, node, maxValidLength});
        return;
    }

    if (!hasId) {
        // No ID exists, report to add one
        reportLackId({context, node, id});
        return;
    }

    // ID exists - validate it (only if validation is enabled)
    if (currentIdValue && validateId) {
        const parsedId = parseId(currentIdValue);

        // Check if ID is parseable
        if (!parsedId) {
            reportLackId({
                context,
                node,
                id,
                message: `Invalid ID format "${currentIdValue}". Expected format: namespace.key:uuid`,
            });
            return;
        }

        // Check if namespace matches
        if (namespace && parsedId.namespace !== namespace) {
            reportLackId({
                context,
                node,
                id,
                message: `Invalid namespace "${parsedId.namespace}" in ID. Expected "${namespace}" based on file path "${filename}"`,
            });
            return;
        }

        // Check if key matches
        // Sanitize translationObjectKey same way as build-id does
        const sanitizedKey = translationObjectKey?.replace(/\./g, '_');
        if (sanitizedKey && parsedId.key !== sanitizedKey) {
            reportLackId({
                context,
                node,
                id,
                message: `Invalid key "${parsedId.key}" in ID. Expected "${sanitizedKey}" to match translation key "${translationObjectKey}"`,
            });
            return;
        }
    }
};
