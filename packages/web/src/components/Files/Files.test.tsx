import React from 'react';
import { render } from '@testing-library/react';
import Files from '.';

jest.mock('next/router', () => ({
    useRouter: (): {} => ({
        events: {
            on: jest.fn(),
            off: jest.fn(),
        },
        query: { path: './' },
    }),
}));

describe(Files, () => {
    test('render', async () => {
        const component = render(<Files />);
        expect(component.getByTestId('files-header')).toBeInTheDocument();
        expect(component.getByTestId('files-path-breadcrumbs')).toBeInTheDocument();
    });
});
