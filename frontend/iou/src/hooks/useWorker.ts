import {useCallback, useEffect, useRef, useState} from "react";


export default function useWorker<TMessage, TReply>(url: URL, callback: (reply: TReply) => void) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const callbackRef = useRef<(reply: TReply) => void>(callback);

  // Subscribe the callback whenever callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const worker = new Worker(url, { type: "module" });
    worker.onmessage = (e) => {
      callbackRef.current(e.data);
    }

    setWorker(worker);

    // Runs once, and should terminate once
    return () => {
      console.warn("Terminating worker for url ", url)
      worker.terminate();
    }
  }, [url, setWorker]);

  return useCallback((message: TMessage) => {
    worker?.postMessage?.(message);
  }, [worker]);
}




