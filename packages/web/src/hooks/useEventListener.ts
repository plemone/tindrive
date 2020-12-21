import {
    useRef,
    useEffect,
    RefObject,
} from 'react';

export default function useEventListener<T extends HTMLElement = HTMLDivElement>(
    eventName: string,
    handler: Function,
    element?: RefObject<T>,
): void {
    const savedHandler = useRef<Function>();
    useEffect(() => {
        const targetElement: T | Window = element?.current || window;
        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }
        if (savedHandler.current !== handler) {
            savedHandler.current = handler;
        }
        const eventListener = (event: Event): void => {
            if (savedHandler?.current) {
                savedHandler.current(event);
            }
        };
        targetElement.addEventListener(eventName, eventListener);
        return (): void => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element, handler]);
}
