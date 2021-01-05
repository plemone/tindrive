import React from 'react';
import { useRouter } from 'next/router';

export default function useRouteLoaderSyncer(loading: boolean | void): boolean {
    const router = useRouter();
    const [customLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(!!loading);
    }, [loading]);

    React.useEffect(() => {
        const handleStart = (url: string): void => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url: string): void => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
    });

    return customLoading;
}
