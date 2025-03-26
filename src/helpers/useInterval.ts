/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useEffect, useRef } from "react";

/** https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
export function useInterval(callback: Function, delay: number) {
  const savedCallback = useRef<Function | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Setup the interval
  useEffect(() => {
    function tick() {
      savedCallback.current!();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
