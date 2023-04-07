import { useState, useEffect } from 'react';

interface UseApiReturnType<T> {
  requestComplete: boolean;
  fetch: (id: string) => Promise<void>;
  requestResult?: T;
  error?: Error;
}

export function useApi<T>(
  apiFunction: (id: string) => Promise<T>,
): UseApiReturnType<T> {
  const [requestComplete, setRequestComplete] = useState(false);
  const [requestResult, setRequestResult] = useState<T>();
  const [error, setError] = useState<Error>();

  const fetchApiData = async (id: string) => {
    try {
      const result = await apiFunction(id);
      setRequestResult(result);
      setRequestComplete(true);
    } catch (e) {
      setError(e);
      setRequestComplete(true);
    }
  };

  useEffect(() => {
    return () => {
      // cleanup function to prevent setting state on an unmounted component
      setRequestResult(undefined);
      setError(undefined);
      setRequestComplete(false);
    };
  }, []);

  return {
    requestComplete,
    fetch: fetchApiData,
    requestResult,
    error,
  };
}
