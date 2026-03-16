import {parseId} from '../parse-id';

describe('parseId', () => {
    it('should parse id without namespace', () => {
        expect(parseId('create:5251Z')).toEqual({
            namespace: '',
            key: 'create',
            uuid: '5251Z',
            raw: 'create:5251Z',
        });
    });

    it('should parse id with simple namespace', () => {
        expect(parseId('issue.field_description:9ntzU')).toEqual({
            namespace: 'issue',
            key: 'field_description',
            uuid: '9ntzU',
            raw: 'issue.field_description:9ntzU',
        });
    });

    it('should parse id with compound namespace', () => {
        expect(parseId('audit-trails.Trail.create:5251Z')).toEqual({
            namespace: 'audit-trails.Trail',
            key: 'create',
            uuid: '5251Z',
            raw: 'audit-trails.Trail.create:5251Z',
        });
    });

    it('should parse id with kebab-case key', () => {
        expect(parseId('issue.action_close-issue:xd1Kb')).toEqual({
            namespace: 'issue',
            key: 'action_close-issue',
            uuid: 'xd1Kb',
            raw: 'issue.action_close-issue:xd1Kb',
        });
    });

    it('should return null for invalid format without colon', () => {
        expect(parseId('invalid-format')).toBeNull();
    });

    it('should return null for empty string', () => {
        expect(parseId('')).toBeNull();
    });

    it('should return null for id without key', () => {
        expect(parseId('namespace.:uuid')).toBeNull();
    });

    it('should return null for id without uuid', () => {
        expect(parseId('namespace.key:')).toBeNull();
    });

    it('should handle complex namespace with multiple dots', () => {
        expect(parseId('a.b.c.d.key:uuid')).toEqual({
            namespace: 'a.b.c.d',
            key: 'key',
            uuid: 'uuid',
            raw: 'a.b.c.d.key:uuid',
        });
    });
});
