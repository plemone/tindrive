import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '.';

describe('Spinner', () => {
    test('render', () => {
        const component = render(<Spinner />);
        expect(component.getByTestId('spinner-determinate')).toHaveClass('MuiCircularProgress-determinate');
        expect(component.getByTestId('spinner-indeterminate')).toHaveClass('MuiCircularProgress-indeterminate');
    });
});
