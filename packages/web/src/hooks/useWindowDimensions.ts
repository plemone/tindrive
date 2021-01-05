import { useState, useEffect } from 'react';
import { getDimensionCutoff } from '../utils';

const getWindowDimensions = (): { width: number; height: number } => {
    if (typeof window === 'undefined') {
        // default desktop screen dimension
        return {
            width: getDimensionCutoff().desktop.max,
            height: 1024,
        };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
};

export default function useWindowDimensions(): { width: number; height: number } {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        const handleResize = (): void => setWindowDimensions(getWindowDimensions());
        window.addEventListener('resize', handleResize);
        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
