import {Rule} from 'eslint';

export interface ReportDecorator<T> {
    context: Rule.RuleContext;
    node: T;
    id: string;
    message?: string;
}
