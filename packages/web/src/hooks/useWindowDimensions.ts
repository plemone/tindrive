import { useState, useEffect } from 'react';

const getWindowDimensions = (): { width: number; height: number } => ({ width: window.innerWidth, height: window.innerHeight });

export default function useWindowDimensions(): { width: number; height: number } {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        const handleResize = (): void => setWindowDimensions(getWindowDimensions());
        window.addEventListener('resize', handleResize);
        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
