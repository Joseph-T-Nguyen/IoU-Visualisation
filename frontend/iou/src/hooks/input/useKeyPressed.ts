import {useCallback, useEffect, useState} from "react";

/**
 * Hook that returns if a given key is pressed. e.g. "Shift"
 * @param targetKey The name of the key. This should be the same as names used in KeyboardEvents
 */
export default function useKeyPressed(targetKey: string): boolean {
  const [isPressed, setIsPressed] = useState(false);

  const downHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === targetKey) {
      setIsPressed(true);
    }
  }, [targetKey]);

  const upHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === targetKey) {
      setIsPressed(false);
    }
  }, [targetKey]);

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey, downHandler, upHandler]);

  return isPressed;
}
