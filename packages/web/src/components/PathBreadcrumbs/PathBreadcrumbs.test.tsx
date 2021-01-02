import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Router from 'next/router';
import PathBreadcrumbs from '.';

describe(PathBreadcrumbs, () => {
    beforeAll(() => {
        jest.mock('next/router', () => ({ push: jest.fn() }));
    });
    test('render', async () => {
        const folders = ['.', 'folder-a', 'folder-b', 'folder-c'];
        const { getByTestId, getByText, getAllByText } = render(
            <PathBreadcrumbs path={`${folders[0]}/${folders[1]}/${folders[2]}/${folders[3]}`} />,
        );
        expect(getByTestId('path-breadcrumbs')).toBeInTheDocument();
        for (let i = 0; i < folders.length; ++i) {
            const pathBreadcrumb = getByTestId(`path-breadcrumbs-button-${i}`);
            const folder = folders[i] === '.' ? 'root' : folders[i];
            expect(pathBreadcrumb).toBeInTheDocument();
            expect(getByText(folder)).toBeInTheDocument();
            fireEvent.click(pathBreadcrumb);
            let path = '';
            for (let j = 0; j < i + 1; ++j) {
                path += `${folders[j]}/`;
            }
            expect(Router.push).toHaveBeenCalledWith({
                pathname: '/',
                query: { path },
            });
        }
        expect(getAllByText('›')).toHaveLength(folders.length - 1);
    });

    test('render with a large path', () => {
        const { getAllByText } = render(
            <PathBreadcrumbs path='./folder-a/folder-b/folder-c/folder-d/folder-e/folder-f/folder-g/folder-h' />,
        );
        expect(getAllByText('›')).toHaveLength(2);
    });
});
