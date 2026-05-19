import {clearSpaceCharacters} from '../../../shared/clear-space-characters';

describe('clearSpaceCharacters', () => {
    it('should remove newlines and leading spaces', () => {
        const input = '   Some \n   Text';
        const result = clearSpaceCharacters(input);
        expect(result).toBe('Some Text');
    });

    it('should handle string without spaces correctly', () => {
        const input = 'SomeText';
        const result = clearSpaceCharacters(input);
        expect(result).toBe('SomeText');
    });

    it('should handle empty string correctly', () => {
        const result = clearSpaceCharacters('');
        expect(result).toBe('');
    });

    it('should not remove spaces in the middle of line', () => {
        const input = 'Some Text';
        const result = clearSpaceCharacters(input);
        expect(result).toBe('Some Text');
    });
});
