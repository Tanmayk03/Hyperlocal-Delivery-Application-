import { useState, useEffect } from "react"; // ✅ Required import

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    const handleResize = () => {
        const checkpoint = window.innerWidth < breakpoint;
        setIsMobile(checkpoint);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return [isMobile]; // returns an array, so you must destructure it when using
};

export default useMobile;
