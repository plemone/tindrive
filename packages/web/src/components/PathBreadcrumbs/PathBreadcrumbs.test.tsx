import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Router from 'next/router';
import PathBreadcrumbs from '.';
import { useWindowDimensions } from '../../hooks';

jest.mock('../../hooks', () => ({
    useWindowDimensions: jest.fn(() => ({
        width: 1024,
        height: 768,
    })),
}));

jest.mock('next/router', () => ({ push: jest.fn() }));

describe(PathBreadcrumbs, () => {
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

    test('responsiveness', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        useWindowDimensions.mockImplementation(() => ({
            width: 360,
            height: 640,
        }));
        const separator = '›';
        const path = './folder-a/folder-b/folder-c/folder-d/folder-e/folder-f/folder-g/folder-h';
        const { getByTestId } = render(
            <PathBreadcrumbs path={path} />,
        );
        expect(getByTestId('path-breadcrumbs'));
        const pathBreadcrumbsButton = getByTestId('path-breadcrumbs-button');
        expect(pathBreadcrumbsButton).toBeInTheDocument();
        expect(pathBreadcrumbsButton).toHaveProperty('title', path.replace('.', 'root').replaceAll('/', ` ${separator} `));
    });
});
