import React from 'react';
import {
    screen,
    render,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { Button } from '@material-ui/core';
import { ContextMenuProvider, useContextMenu } from '.';

describe('ContextMenu', () => {
    const renameFn = jest.fn();
    const moveToTrashFn = jest.fn();
    const menuItems = [
        {
            name: 'rename',
            title: 'Rename',
            handler: renameFn,
        },
        {
            name: 'moveToTrash',
            title: 'Move to Trash',
            handler: moveToTrashFn,
        },
    ];
    const ShowContextMenu: React.FC = () => {
        const { openContextMenu } = useContextMenu();
        return (
            <Button onClick={e => {
                openContextMenu(e, menuItems);
            }}
            >
                Show Context Menu
            </Button>
        );
    };

    beforeEach(() => {
        render(
            <ContextMenuProvider>
                <ShowContextMenu />
            </ContextMenuProvider>,
        );
    });

    test('if no menu item is rendered if no function is called', async () => {
        expect(screen.getByText('Show Context Menu')).toBeInTheDocument();
        expect(screen.queryByText('Rename')).toBeFalsy();
        expect(screen.queryByText('Move to Trash')).toBeFalsy();
    });

    test('if clicking on the button opens up the context menu', async () => {
        fireEvent.click(screen.getByText('Show Context Menu'));
        expect(screen.getByText('Rename')).toBeInTheDocument();
        expect(screen.getByText('Move to Trash')).toBeInTheDocument();
    });

    test('if clicking a menu item executes the desired functionalities and closes the menu', async () => {
        fireEvent.click(screen.getByText('Show Context Menu'));
        await waitFor(() => {
            fireEvent.click(screen.getByText('Rename'));
        });
        expect(renameFn.mock.calls.length).toBe(1);

        fireEvent.click(screen.getByText('Show Context Menu'));
        await waitFor(() => {
            fireEvent.click(screen.getByText('Move to Trash'));
        });
        expect(moveToTrashFn.mock.calls.length).toBe(1);
    });
});
