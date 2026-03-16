import {Node} from 'estree';

import {BaseRuleOptions} from '../BaseRuleOptions';
import {NodeWithParent} from '../NodeWithParent';
import {ReportDecorator} from '../handlers';

import {DefaultReportMaxValidLengthExceededProps} from './DefaultReportMaxValidLengthExceededProps';

export interface CheckIdProps extends BaseRuleOptions {
    reportLackId: (props: ReportDecorator<Node | NodeWithParent<Node>>) => void;
    reportMaxValidLengthExceeded?: (props: DefaultReportMaxValidLengthExceededProps) => void;

    hasId: boolean;
    currentIdValue: string;
    translationObjectKey?: string;
    node: Node;
    validateId?: boolean;
}
