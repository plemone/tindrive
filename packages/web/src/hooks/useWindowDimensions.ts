import { useState, useEffect } from 'react';
import { getDeviceDimensions } from '../utils';

// Read this again to understand why we need useEffect: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
export default function useWindowDimensions(): { width: number; height: number } {
    const [windowSize, setWindowSize] = useState({
        width: getDeviceDimensions().desktop.max,
        height: 1024,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = (): void => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            window.addEventListener('resize', handleResize);

            // Call handleResize right away on initial window size change.
            handleResize();

            return (): void => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowSize;
}
