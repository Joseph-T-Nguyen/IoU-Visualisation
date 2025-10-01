import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import * as THREE from "three";
import {BufferGeometry, Float32BufferAttribute} from "three";

const EPSILON = 1e-6;

export interface WorkerGeometryInput2D {
  position: Float32Array,
  normal: Float32Array
}

export interface WorkerInput2D {
  meshes: WorkerGeometryInput2D[]
}

export interface IntersectionWorkerReply2D {
  position?: Float32Array,
  normal?: Float32Array,
  iou?: number
}

/**
 * Project 3D geometry to 2D by extracting the face that's most visible from Z-axis perspective
 * This creates a 2D silhouette/projection of the 3D shape
 */
function projectGeometryToXY(geometry: THREE.BufferGeometry): THREE.Vector2[] {
  const position = geometry.attributes.position;
  const points2D: THREE.Vector2[] = [];
  
  // Extract all vertices and project to XY plane
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    points2D.push(new THREE.Vector2(x, y));
  }
  
  // Remove duplicate points within epsilon
  const uniquePoints: THREE.Vector2[] = [];
  for (const point of points2D) {
    const isDuplicate = uniquePoints.some(existing => 
      Math.abs(existing.x - point.x) < EPSILON && 
      Math.abs(existing.y - point.y) < EPSILON
    );
    if (!isDuplicate) {
      uniquePoints.push(point);
    }
  }
  
  return uniquePoints;
}

/**
 * Calculate the convex hull of 2D points using Gift Wrapping algorithm
 */
function convexHull2D(points: THREE.Vector2[]): THREE.Vector2[] {
  if (points.length < 3) return points;
  
  // Find the leftmost point
  let leftmost = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x < points[leftmost].x) {
      leftmost = i;
    }
  }
  
  const hull: THREE.Vector2[] = [];
  let p = leftmost;
  
  do {
    hull.push(points[p]);
    let q = (p + 1) % points.length;
    
    for (let i = 0; i < points.length; i++) {
      const orientation = getOrientation(points[p], points[i], points[q]);
      if (orientation === 2) {
        q = i;
      }
    }
    
    p = q;
  } while (p !== leftmost);
  
  return hull;
}

/**
 * Get orientation of ordered triplet (p, q, r)
 * 0 -> p, q and r are colinear
 * 1 -> Clockwise
 * 2 -> Counterclockwise
 */
function getOrientation(p: THREE.Vector2, q: THREE.Vector2, r: THREE.Vector2): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (Math.abs(val) < EPSILON) return 0;
  return (val > 0) ? 1 : 2;
}

/**
 * Calculate the area of a 2D polygon using the shoelace formula
 */
function calculatePolygonArea(points: THREE.Vector2[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
function isPointInPolygon(point: THREE.Vector2, polygon: THREE.Vector2[]): boolean {
  let inside = false;
  const n = polygon.length;
  
  for (let i = 0, j = n - 1; i < n; j = i++) {
    if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
        (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
      inside = !inside;
    }
  }
  
  return inside;
}

/**
 * Calculate intersection of two 2D polygons using Sutherland-Hodgman clipping algorithm
 */
function calculatePolygonIntersection(subject: THREE.Vector2[], clip: THREE.Vector2[]): THREE.Vector2[] {
  if (subject.length === 0 || clip.length === 0) return [];
  
  let outputList = [...subject];
  
  for (let i = 0; i < clip.length; i++) {
    if (outputList.length === 0) break;
    
    const clipVertex1 = clip[i];
    const clipVertex2 = clip[(i + 1) % clip.length];
    const inputList = [...outputList];
    outputList = [];
    
    if (inputList.length === 0) continue;
    
    let s = inputList[inputList.length - 1];
    
    for (const e of inputList) {
      if (isInside(e, clipVertex1, clipVertex2)) {
        if (!isInside(s, clipVertex1, clipVertex2)) {
          const intersection = getIntersection(s, e, clipVertex1, clipVertex2);
          if (intersection) outputList.push(intersection);
        }
        outputList.push(e);
      } else if (isInside(s, clipVertex1, clipVertex2)) {
        const intersection = getIntersection(s, e, clipVertex1, clipVertex2);
        if (intersection) outputList.push(intersection);
      }
      s = e;
    }
  }
  
  return outputList;
}

function isInside(point: THREE.Vector2, lineStart: THREE.Vector2, lineEnd: THREE.Vector2): boolean {
  return ((lineEnd.x - lineStart.x) * (point.y - lineStart.y) - (lineEnd.y - lineStart.y) * (point.x - lineStart.x)) >= 0;
}

function getIntersection(p1: THREE.Vector2, p2: THREE.Vector2, p3: THREE.Vector2, p4: THREE.Vector2): THREE.Vector2 | null {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < EPSILON) return null;
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  
  return new THREE.Vector2(
    p1.x + t * (p2.x - p1.x),
    p1.y + t * (p2.y - p1.y)
  );
}

/**
 * Convert 2D intersection polygon back to 3D geometry for rendering
 */
function create3DGeometryFromPolygon(polygon: THREE.Vector2[]): THREE.BufferGeometry | undefined {
  if (polygon.length < 3) return undefined;
  
  const vertices: number[] = [];
  const normals: number[] = [];
  
  // Triangulate the polygon using fan triangulation
  for (let i = 1; i < polygon.length - 1; i++) {
    // Add triangle: [0, i, i+1]
    vertices.push(polygon[0].x, polygon[0].y, 0);
    vertices.push(polygon[i].x, polygon[i].y, 0);
    vertices.push(polygon[i + 1].x, polygon[i + 1].y, 0);
    
    // All normals point up in Z direction
    normals.push(0, 0, 1);
    normals.push(0, 0, 1);
    normals.push(0, 0, 1);
  }
  
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  
  return geometry;
}

/**
 * Calculate 2D IoU (Intersection over Union) for area-based shapes
 */
function calculate2DIntersectionAndIoU(geometries: THREE.BufferGeometry[]): {intersection?: THREE.BufferGeometry, iou?: number} {
  if (geometries.length < 2) {
    return {};
  }
  
  // Project each 3D geometry to 2D and get convex hull
  const polygons = geometries.map(geo => {
    const projected = projectGeometryToXY(geo);
    return convexHull2D(projected);
  });
  
  // Calculate intersection of all polygons
  let intersection = polygons[0];
  for (let i = 1; i < polygons.length; i++) {
    intersection = calculatePolygonIntersection(intersection, polygons[i]);
    if (intersection.length === 0) break; // No intersection
  }
  
  if (intersection.length < 3) {
    return { iou: 0 };
  }
  
  // Calculate areas
  const intersectionArea = calculatePolygonArea(intersection);
  const individualAreas = polygons.map(polygon => calculatePolygonArea(polygon));
  
  // Calculate union area (sum of individual areas minus intersection area)
  const totalArea = individualAreas.reduce((sum, area) => sum + area, 0);
  const unionArea = totalArea - intersectionArea;
  
  const iou = unionArea > 0 ? intersectionArea / unionArea : 0;
  
  // Create 3D geometry for visualization
  const intersectionGeometry = create3DGeometryFromPolygon(intersection);
  
  return {
    intersection: intersectionGeometry,
    iou: iou
  };
}

self.onmessage = (event: MessageEvent<Vec3[]>) => {
  try {
    const geometries = (event.data as unknown as WorkerInput2D).meshes;
    const buffers = geometries
      .map((geo) => {
        const buffer = new BufferGeometry();
        buffer.setAttribute('position', new Float32BufferAttribute(geo.position, 3));
        buffer.setAttribute('normal', new Float32BufferAttribute(geo.normal, 3));
        return buffer;
      });

    const result = calculate2DIntersectionAndIoU(buffers);
    
    if (result.intersection) {
      const reply = {
        position: result.intersection.getAttribute("position").array,
        normal: result.intersection.getAttribute("normal").array,
        iou: result.iou
      } as IntersectionWorkerReply2D;
      
      self.postMessage(reply, { transfer: [reply.position!.buffer, reply.normal!.buffer] });
    } else {
      self.postMessage({ iou: result.iou });
    }
  } catch (e) {
    console.error("Error in 2D intersection worker:", e);
    self.postMessage({ iou: 0 }); // Send zero IoU on error
  }
};