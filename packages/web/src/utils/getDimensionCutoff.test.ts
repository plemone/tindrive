import { getDimensionCutoff } from '.';

describe(getDimensionCutoff, () => {
    test('if function returns an object', () => {
        expect(typeof getDimensionCutoff()).toBe('object');
    });
});
