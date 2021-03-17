import * as imports from '.';

describe('queries', () => {
    test('imports', () => {
        const allowed = ['ls'];
        const functionSet = new Set(Object.keys(imports));
        allowed.forEach(util => expect(functionSet.has(util)).toBeTruthy());
    });
});
