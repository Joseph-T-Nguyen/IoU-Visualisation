import {type DependencyList, useCallback, useEffect} from "react";

export interface ModifiedKey {
  key: string,
  shift?: boolean,
  ctrl?: boolean,
  alt?: boolean,
  meta?: boolean,
}

/**
 * Hook that returns if a given key is pressed. e.g. "Shift"
 * @param targetKey The name of the key (and any required modifier key states). This should be the same as names used in KeyboardEvents
 * @param callback Input to useCallback, called whenever the key is pressed down
 * @param deps Deps array for useCallback
 */
export default function useOnKeyDown(targetKey: string | ModifiedKey, callback: () => void, deps: DependencyList): void {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cachedCallback = useCallback(callback, deps);

  const downHandler = useCallback((event: KeyboardEvent) => {
    const modifiedKey = typeof targetKey === "string" ? {key: targetKey} : targetKey;

    if (event.key.toLowerCase() !== modifiedKey.key.toLowerCase())
      return;
    if (modifiedKey.alt !== undefined && event.altKey !== (modifiedKey.alt ?? false))
      return;
    if (modifiedKey.ctrl !== undefined && event.ctrlKey !== (modifiedKey.ctrl ?? false))
      return;
    if (modifiedKey.shift !== undefined && event.shiftKey !== (modifiedKey.shift ?? false))
      return;
    if (modifiedKey.meta !== undefined && event.metaKey !== (modifiedKey.meta ?? false))
      return;

    cachedCallback();
  }, [targetKey, cachedCallback]);

  useEffect(() => {
    window.addEventListener("keydown", downHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [downHandler]);
}
