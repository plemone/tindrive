import React from 'react';
import Cookie from 'js-cookie';

export default function useCookie(key: string, value: string): void {
    React.useEffect(() => {
        Cookie.set(key, value);
    }, [key, value]);
}
