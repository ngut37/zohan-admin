import { useEffect, useRef } from 'react';

export function useDebouncedEffect(
  effect: () => (() => void) | void,
  deps: any[] | undefined,
  wait: number,
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  useEffect(() => {
    cleanup();

    timeout.current = setTimeout(() => {
      const cleanupEffect = effect();
      if (cleanupEffect) {
        return cleanupEffect;
      }
    }, wait);

    return cleanup;
  }, deps);
}
