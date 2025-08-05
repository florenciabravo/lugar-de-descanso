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
            const token = localStorage.getItem("token");

            const options = {
                method: method,
                headers: {
                    ...(bodyData instanceof FormData
                        ? {}
                        : { 'Content-type': 'application/json; charset=UTF-8' }),
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: method == 'GET' || method == 'DELETE'
                    ? null
                    : bodyData instanceof FormData
                        ? bodyData
                        : JSON.stringify(bodyData),
            }

            const res = await fetch(url, options)

            const contentType = res.headers.get("Content-Type");

            let data = null;

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else if (res.status === 204) {
                data = { success: true }; // para DELETE exitoso sin cuerpo
            } else {
                const text = await res.text();
                console.warn("Respuesta inesperada:", text);
                data = { raw: text }; // lo devolvemos igual para que no sea null
            }

            if (!res.ok) {
                throw new Error(
                        data?.error || data?.message || data?.raw || "Ocurrio un error inesperadooo");
            }
            setState({ data, isLoading: false, error: null });
            return data;
        }
        catch (error) {
            console.error("fetchData error:", error); // Log del error real
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