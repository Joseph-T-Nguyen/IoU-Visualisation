import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import { CSG } from 'three-csg-ts';
import * as THREE from "three";
import {BufferGeometry, Float32BufferAttribute} from "three";

export type BufferGeometryMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>

const EPSILON = 1e-6;

/**
 * Compute the volume of a closed BufferGeometry mesh.
 * Assumes the geometry is composed of triangles.
 *
 * @param {THREE.BufferGeometry} geometry
 * @returns {number} volume
 */
export function computeGeometryVolume(geometry: THREE.BufferGeometry): number {
  const position = geometry.attributes.position;
  if (!position)
    return 0;

  let volume = 0;

  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pC = new THREE.Vector3();

  const vectorCross = new THREE.Vector3();

  if (position.count <= 3)
    return 0;

  // Loop over each triangle
  for (let i = 0; i < position.count; i += 3) {
    pA.fromBufferAttribute(position, i);
    pB.fromBufferAttribute(position, i + 1);
    pC.fromBufferAttribute(position, i + 2);

    // Compute cross product of B x C
    vectorCross.crossVectors(pB, pC);

    // Compute the signed volume contribution
    volume += pA.dot(vectorCross) / 6;
  }

  return Math.abs(volume);
}

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

  iou?: number
}

/**
 * Uses three-csg-ts to calculate the intersection of all the given shape geometries, by first creating meshes with the
 * geometries.
 * @param geometries The current registered geometries
 */
const calculateNewIntersectionGeometry = (buffers: THREE.BufferGeometry[]) => {
  if (buffers.length < 2)
    return undefined;

  const meshes = buffers
    .map(geo => new THREE.Mesh(geo) as BufferGeometryMesh);

  if (meshes[0].geometry.getAttribute('position').count === 3)
    return undefined;

  const intersectionMesh = meshes
    .slice(1)
    .reduce((acc: THREE.Mesh | undefined, value: THREE.Mesh) => {
      if (acc === undefined)
        return undefined

      const newAcc = CSG.intersect(acc, value);

      // Filter triangles
      if (newAcc.geometry.getAttribute('position').count === 3)
        return undefined;
      if (newAcc.geometry.getAttribute('position').count === 0)
        return undefined;
      return newAcc;
    }, meshes[0]);

  return intersectionMesh?.geometry as THREE.BufferGeometry | undefined;
}

function calculateIOU(buffers: THREE.BufferGeometry[], intersection: THREE.BufferGeometry) {

  if (buffers.length < 2 || intersection === undefined)
    return undefined;

  const intersectionVolume = computeGeometryVolume(intersection);

  if (buffers.length == 2) {
    const unionVolumeWithOvercount = buffers
      .map(buffer => computeGeometryVolume(buffer))
      .reduce((acc, v) => acc + v)
    const unionVolume = unionVolumeWithOvercount - intersectionVolume;

    return intersectionVolume / unionVolume;
  }

  // Otherwise we need to calculate the union to get the union volume
  const meshes = buffers
    .map(geo => new THREE.Mesh(geo) as BufferGeometryMesh);

  const unionMesh = meshes
    .slice(1)
    .reduce((acc: THREE.Mesh | undefined, value: THREE.Mesh) => {
      if (acc === undefined)
        return undefined

      const newAcc = CSG.union(acc, value);

      if (newAcc.geometry.getAttribute('position').count === 0)
        return undefined;
      return newAcc;
    }, meshes[0]);

  const union = unionMesh?.geometry;
  const unionVolume = union ? computeGeometryVolume(union) : 0;

  return union ? intersectionVolume / unionVolume : undefined;
}

self.onmessage = (event: MessageEvent<Vec3[]>) => {
  try {
    const geometries = (event.data as unknown as WorkerInput).meshes;
    const buffers = geometries
      .map((geo) => {
        const buffer = new BufferGeometry();

        buffer.setAttribute( 'position', new Float32BufferAttribute(geo.position, 3));
        buffer.setAttribute( 'normal', new Float32BufferAttribute(geo.normal, 3));
        return buffer;
      });

    const volumes = buffers.map(buffer => computeGeometryVolume(buffer))
    const anyVolumesAreFlat = volumes
      .map(v => Math.abs(v) < EPSILON)
      .reduce((a, b) => a || b, false);

    // Prevent flat shapes from causing chaos
    if (anyVolumesAreFlat) {
      self.postMessage({});
      return;
    }

    const intersection = calculateNewIntersectionGeometry(buffers);

    if (intersection === undefined) {
      self.postMessage({});
      return;
    }

    const iou = intersection ? calculateIOU(buffers, intersection) : undefined;

    const reply = {
      position: intersection.getAttribute("position").array,
      normal: intersection.getAttribute("normal").array,
      iou
    } as IntersectionWorkerReply;

    self.postMessage(reply, { transfer: [reply.position!.buffer, reply.normal!.buffer] });
  } catch (e) {
    console.error("Error in intersection worker:", e);
    self.postMessage({}); // Send an empty message on error
  }
}