import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '.';

describe(Spinner, () => {
    test('render', () => {
        const { getByTestId } = render(<Spinner />);
        expect(getByTestId('spinner-determinate')).toHaveClass('MuiCircularProgress-determinate');
        expect(getByTestId('spinner-indeterminate')).toHaveClass('MuiCircularProgress-indeterminate');
    });
});
