import * as utils from '.';

describe('utils', () => {
    test('if utils contains the correct functions', () => {
        const allowedUtils = ['getDeviceDimensions'];
        const functionSet = new Set(Object.keys(utils));
        allowedUtils.forEach(util => expect(functionSet.has(util)).toBeTruthy());
    });

    test('if each util is a function', () => {
        const functions = Object.values(utils);
        functions.forEach(func => expect(typeof func).toBe('function'));
    });
});
