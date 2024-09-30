import { useState, useEffect } from "react";

function useDebounce(value, delay) {
    const [debouncealue, setDebounceValue] = useState(value)

    useEffect(() => {

        const handeler = setTimeout(() => setDebounceValue(value), delay);

        return () => clearTimeout(handeler);

    }, [value,delay])

    return debouncealue;
}

export default useDebounce;