import * as imports from '.';

describe('config', () => {
    test('imports', () => {
        const allowed = ['theme'];
        const functionSet = new Set(Object.keys(imports));
        allowed.forEach(util => expect(functionSet.has(util)).toBeTruthy());
    });
});
