/* eslint-disable no-restricted-syntax */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/client/testing';
import { ls } from '../../queries';
import Files from '.';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const data = [
    {
        name: 'dotfiles',
        path: './dotfiles',
        extension: null,
        isDirectory: true,
        parentDirectory: '.',
        createdDate: '2020-11-05T03:03:46.950Z',
        size: 4096,
        populatedDate: '2020-12-13T18:10:38.000Z',
    },
    {
        name: 'interview',
        path: './interview',
        extension: null,
        isDirectory: true,
        parentDirectory: '.',
        createdDate: '2020-11-05T05:34:51.219Z',
        size: 4096,
        populatedDate: '2020-12-13T18:10:38.000Z',
    },
];

const Wrapper: React.FC = () => (
    <MockedProvider
        addTypename={false}
        mocks={[{
            request: {
                query: ls,
                variables: { path: './' },
            },
            result: { data: { ls: data } },
        }]}
    >
        <Files />
    </MockedProvider>
);

describe('Files', () => {
    beforeAll(() => useRouter.mockImplementationOnce(() => ({ query: {} })));

    test('render', async () => {
        const { getByTestId, findByText } = render(<Wrapper />);
        expect(getByTestId('files-spinner')).toBeInTheDocument();
        expect(await getByTestId('files'));
        let index = 0;
        for await (const folder of data) {
            expect(await findByText(folder.name)).toBeInTheDocument();
            expect(await getByTestId(`files-file-${index++}`));
        }
        expect(await getByTestId('files-path-breadcrumbs'));
    });
});
