import React from 'react';
import Cookie from 'js-cookie';

export default function useCookie(key, value): void {
    React.useEffect(() => {
        Cookie.set(key, value);
    }, [key, value]);
}
