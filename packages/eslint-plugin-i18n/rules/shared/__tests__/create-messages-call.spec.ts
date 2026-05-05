import {createFilenamePredicate} from '../create-messages-call';

describe('createFilenamePredicate', () => {
    describe('string suffix matcher', () => {
        it('matches path ending with /suffix', () => {
            const m = createFilenamePredicate('i18n.ts');
            expect(m('/project/src/widget/i18n.ts')).toBe(true);
        });

        it('matches path equal to suffix', () => {
            const m = createFilenamePredicate('i18n.ts');
            expect(m('i18n.ts')).toBe(true);
        });

        it('does not match nested basename', () => {
            const m = createFilenamePredicate('i18n.ts');
            expect(m('/project/src/widget/foo.i18n.ts')).toBe(false);
        });

        it('normalizes Windows separators', () => {
            const m = createFilenamePredicate('i18n.ts');
            expect(m(String.raw`C:\project\src\widget\i18n.ts`)).toBe(true);
        });
    });

    describe('{ type: regexp } on normalized path', () => {
        it('matches pattern against path', () => {
            const m = createFilenamePredicate({
                type: 'regexp',
                pattern: String.raw`\.i18n\.ts$`,
            });
            expect(m('/project/foo.i18n.ts')).toBe(true);
            expect(m('/project/i18n.ts')).toBe(false);
        });

        it('respects flags', () => {
            const m = createFilenamePredicate({
                type: 'regexp',
                pattern: String.raw`FOO\.I18N\.TS$`,
                flags: 'i',
            });
            expect(m('/x/foo.i18n.ts')).toBe(true);
        });

        it('invalid pattern never matches', () => {
            const m = createFilenamePredicate({
                type: 'regexp',
                pattern: '(',
            });
            expect(m('/any/path.ts')).toBe(false);
        });
    });
});
