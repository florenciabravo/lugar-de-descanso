import { useState } from "react"

export const useFetch = () => {

    const [state, setState] = useState({
        data: null,
        isLoading: false,
        error: null
    })

    const { data, isLoading, error } = state

    const fetchData = async (url, method, bodyData = null) => {
        if (!url) return;

        setState({ data: null, isLoading: true, error: null });

        try {

            const options = {
                method: method,
                headers: bodyData instanceof FormData ? {} : {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: method == 'GET' || method == 'DELETE' ? null 
                    : bodyData instanceof FormData ? bodyData 
                    : JSON.stringify(bodyData)
            }

            const res = await fetch(url, options)
            const data = res.headers.get("Content-Type")?.includes("application/json")
                ? await res.json()
                : null;

            if (!res.ok) {
                throw new Error(data?.error || "Ocurrio un error inesperadooo");
            }
            setState({ data, isLoading: false, error: null })
            return data;
        }
        catch (error) {
            setState({
                data: null,
                error: error.message,
                isLoading: false,
            });
            return { error: error.message };
        }
    };

    return { data, isLoading, error, fetchData };
};