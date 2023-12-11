// Hook to access the window origin

import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    // If the window is available, then we check if window.location exists then we use the 'window.location.origin', otherwise we use an empty string. 
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return '';
    }

    return origin;

}