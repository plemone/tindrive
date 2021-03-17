import * as imports from '.';

describe('utils', () => {
    test('imports', () => {
        const allowed = ['getDeviceDimensions', 'getAllExtensions', 'getExtensionDescriptions'];
        const functionSet = new Set(Object.keys(imports));
        allowed.forEach(util => expect(functionSet.has(util)).toBeTruthy());
    });
});
