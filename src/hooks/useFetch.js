import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import useLocalStorage from "./useLocalStorage";

export default function useFetch(url) {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [message, setMessage] = useState(null);
    const [options, setOptions] = useState({});
    const [token] = useLocalStorage("token");
    const [isSuccess, setIsSuccess] = useState(false);
    const doFetch = useCallback((options = {}) => {
        setOptions(options);
        setIsLoading(true);
    }, []);

    useEffect(() => {
        if (!isLoading) return;

        const fetchUrl = async () => {
            setMessage("");

            try {
                const requestOptions =  {
                    ...options,
                    headers: {
                        ...(options.headers || {}),
                        authorization: token ? `Token ${token}` : "",
                    },                
                };

                const res = await axios(url, requestOptions);
                setResponse(res.data);
                if (res.status === 204) {
                    setIsSuccess(true);
                  }
                setMessage(null);
            } catch (error) {
                const errorData = error.response?.data;
                setMessage(errorData?.errors || errorData?.message || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUrl();

    }, [isLoading, options, url, token]);

    return [{ isLoading, response, message, isSuccess }, doFetch];
}