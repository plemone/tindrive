/* eslint-disable guard-for-in */
import { getDeviceDimensions } from '.';

describe('getDeviceDimensions', () => {
    test('if getDeviceDimensions is a function', () => {
        expect(typeof getDeviceDimensions).toBe('function');
    });

    test('if function returns an object', () => {
        expect(typeof getDeviceDimensions()).toBe('object');
    });

    test('if dimensions contains configurations for all devices', () => {
        const devices = ['mobile', 'tablet', 'desktop', 'television'];
        const dimensions = getDeviceDimensions();
        const deviceSet = new Set(Object.keys(dimensions));
        devices.forEach(device => expect(deviceSet.has(device)).toBeTruthy());
    });

    test('if each dimension object contains a minimum and maximum value', () => {
        const dimensions = getDeviceDimensions();
        // eslint-disable-next-line no-restricted-syntax
        for (const key in dimensions) {
            const deviceDimension = dimensions[key];
            const valueKeys = Object.keys(deviceDimension);
            expect(valueKeys).toEqual(['min', 'max']);
        }
    });
});
