import { useState, useEffect } from 'react';

interface UseApiReturnType<T> {
  requestComplete: boolean;
  fetch: (...arg: any[]) => Promise<void>;
  requestResult?: T;
  error?: Error;
}

export function useApi<T>(
  apiFunction: (...arg: any) => Promise<T>,
): UseApiReturnType<T> {
  const [requestComplete, setRequestComplete] = useState(false);
  const [requestResult, setRequestResult] = useState<T>();
  const [error, setError] = useState<Error>();

  const fetchApiData = async (arg: any[]) => {
    try {
      const result = await apiFunction(arg);
      setRequestResult(result);
      setRequestComplete(true);
    } catch (error) {
      setError(error);
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
