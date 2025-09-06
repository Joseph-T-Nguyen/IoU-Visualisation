import {useCallback, useEffect, useRef, useState} from "react";
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {BufferGeometry, Float32BufferAttribute} from "three";
import useWorker from "@/hooks/useWorker.ts";
import type {ConvexHullResult} from "@/hooks/convexWorker.ts";

const workerUrl = new URL("./convexWorker", import.meta.url);
const defaultGeometry = new BufferGeometry();
defaultGeometry.setAttribute( 'position', new Float32BufferAttribute([], 3));
defaultGeometry.setAttribute( 'normal', new Float32BufferAttribute([], 3));
defaultGeometry.name = "defaultGeometry";


export default function useConvexHull(vertices: Vec3[]): BufferGeometry {
  const [geometry, setGeometry] = useState<BufferGeometry>(defaultGeometry);

  const runningRef = useRef<boolean>(false);
  const pendingDataRef = useRef<Vec3[] | null>(null);

  const send = useWorker<Vec3[], ConvexHullResult>(workerUrl, (reply) => {
    // Apply result from worker
    const buffer = new BufferGeometry();
    // TODO: Use FloatArrays instead when transferring data between the worker and the main thread
    buffer.setAttribute( 'position', new Float32BufferAttribute(reply.vertices, 3));
    buffer.setAttribute( 'normal', new Float32BufferAttribute(reply.normals, 3));

    setGeometry(buffer);

    // If we don't have more data to calculate, stop
    if (pendingDataRef.current === null) {
      runningRef.current = false;
      return;
    }

    // Start new job on the queued data
    // noinspection UnreachableCodeJS
    const pendingData = pendingDataRef.current!;
    pendingDataRef.current = null;
    send(pendingData);
  });

  // When called either starts the convex hull calculation, or queues a calculation
  const startCalculation = useCallback((input: Vec3[]) => {
    if (runningRef.current) {
      pendingDataRef.current = input;
      return;
    }

    // console.log("startCalculation", input);
    runningRef.current = true;
    const inputCopy = [...input];
    send(inputCopy);
  }, [send]);

  useEffect(() => {
    // Restart calculation since we have a new worker
    runningRef.current = false;
    startCalculation(vertices);
  }, [send]);

  useEffect(() => {
    startCalculation(vertices);
  }, [vertices, startCalculation]);

  return geometry;
}
