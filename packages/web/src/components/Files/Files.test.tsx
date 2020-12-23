import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/client/testing';
import Files from '.';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const Wrapper: React.FC = () => {
    const mocks = [];
    return (
        <MockedProvider
            addTypename={false}
            mocks={mocks}
        >
            <Files />
        </MockedProvider>
    );
};

describe('Files', () => {
    beforeAll(() => {
        useRouter.mockImplementationOnce(() => ({ query: {} }));
    });

    test('render', () => {
        render(<Wrapper />);
    });
});
