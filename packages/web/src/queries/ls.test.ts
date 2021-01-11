/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ls } from '.';

describe('ls query', () => {
    test('if query is a apollo object', () => {
        const keys = Object.keys(ls);
        expect(keys).toEqual(['kind', 'definitions', 'loc']);
    });
    test('if query can accept path as a parameter', () => {
        // @ts-ignore
        expect(ls.definitions[0].variableDefinitions[0].variable.name.value).toBe('path');
    });
});
