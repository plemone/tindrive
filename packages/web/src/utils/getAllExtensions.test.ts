import { getAllExtensions } from '.';

describe(getAllExtensions, () => {
    test('if getAllExtensions is a function', () => {
        expect(typeof getAllExtensions).toBe('function');
    });

    test('if function returns an object', () => {
        expect(typeof getAllExtensions()).toBe('object');
    });
});
