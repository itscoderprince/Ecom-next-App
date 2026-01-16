import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const requestOptions = useMemo(() => {
    const opts = { ...options };

    if (method === "POST" && !opts.data) {
      opts.data = {};
    }

    return opts;
  }, [method, JSON.stringify(options)]);

  useEffect(() => {
    const apiCall = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });

        if (!response.success) throw new Error(response.message);

        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    apiCall();
  }, [url, method, requestOptions, refreshIndex]);

  const refetch = () => setRefreshIndex((prev) => prev + 1);

  return { data, loading, error, refetch };
};

export default useFetch;
