import { theme } from '.';

describe('theme', () => {
    test('theme overrides', () => expect(theme.palette.type).toBe('dark'));
});
