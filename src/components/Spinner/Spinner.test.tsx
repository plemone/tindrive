import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '.';

describe('Spinner', () => {
    test('render', () => {
        const component = render(<Spinner />);
        const spinner = component.container;
        expect(spinner.firstElementChild?.children[0]).toHaveClass('MuiCircularProgress-determinate');
        expect(spinner.firstElementChild?.children[1]).toHaveClass('MuiCircularProgress-indeterminate');
    });
});
