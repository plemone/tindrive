import React from 'react';
import { useRouter } from 'next/router';

export default function useRouteLoaderSyncer(loading: boolean | void): boolean {
    const router = useRouter();
    const [customLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(!!loading);
    }, [loading]);

    React.useEffect(() => {
        const handleStart = (): void => setLoading(true);
        const handleComplete = (): void => setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return (): void => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    });

    return customLoading;
}
