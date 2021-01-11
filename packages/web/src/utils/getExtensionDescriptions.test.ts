import { getExtensionDescriptions } from '.';

describe(getExtensionDescriptions, () => {
    test('if getExtensionDescriptions is a function', () => {
        expect(typeof getExtensionDescriptions).toBe('function');
    });

    test('if the correct value is returned for a given input', () => {
        const descriptions = getExtensionDescriptions('js');
        expect(descriptions[0]).toBe('JavaScript file');
    });
});
