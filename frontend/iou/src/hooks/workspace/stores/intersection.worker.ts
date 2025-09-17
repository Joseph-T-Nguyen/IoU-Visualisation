/// <reference lib="webworker" />

import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import { CSG } from 'three-csg-ts';
import * as THREE from "three";
import {BufferGeometry, Float32BufferAttribute} from "three";

export type BufferGeometryMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>

export interface WorkerGeometryInput {
  position: Float32Array,
  normal: Float32Array
}
export interface WorkerInput {
  meshes: WorkerGeometryInput[]
}
export interface IntersectionWorkerReply {
  position?: Float32Array,
  normal?: Float32Array
}

/**
 * Uses three-csg-ts to calculate the intersection of all the given shape geometries, by first creating meshes with the
 * geometries.
 * @param geometries The current registered geometries
 */
const calculateNewIntersectionGeometry = (geometries: WorkerGeometryInput[]) => {
  if (geometries.length < 2)
    return undefined;

  const meshes = geometries
    .map((geo) => {
      const buffer = new BufferGeometry();

      buffer.setAttribute( 'position', new Float32BufferAttribute(geo.position, 3));
      buffer.setAttribute( 'normal', new Float32BufferAttribute(geo.normal, 3));
      return buffer;
    })
    .map(geo => new THREE.Mesh(geo) as BufferGeometryMesh);

  const intersectionMesh = meshes
    .slice(1)
    .reduce((acc: THREE.Mesh | undefined, value: THREE.Mesh) => {
      if (acc === undefined)
        return undefined

      const newAcc = CSG.intersect(acc, value);

      if (newAcc.geometry.getAttribute('position').count === 0)
        return undefined;
      return newAcc;
    }, meshes[0]);

  return intersectionMesh?.geometry as THREE.BufferGeometry | undefined;
}

self.onmessage = (event: MessageEvent<Vec3[]>) => {
  const geometries = (event.data as unknown as WorkerInput).meshes;
  const intersection = calculateNewIntersectionGeometry(geometries);

  if (intersection === undefined) {
    self.postMessage({
      position: undefined,
      normal: undefined,
    });
    return;
  }

  const reply = {
    position: intersection.getAttribute("position").array,
    normal: intersection.getAttribute("normal").array,
  } as IntersectionWorkerReply;

  self.postMessage(reply, [reply.position!.buffer, reply.normal!.buffer]);
}
