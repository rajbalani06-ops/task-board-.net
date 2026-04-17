import { useState, useCallback } from "react";

function useApi(apiFunc) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const request = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFunc(...args);
      setData(res);

      return res;
    } catch (err) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { loading, error, data, request };
}

export default useApi;