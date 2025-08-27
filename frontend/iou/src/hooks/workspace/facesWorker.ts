// facesWorker.ts
self.onmessage = async (e: MessageEvent) => {
  const { id, vertices } = e.data as { id: string; vertices: number[][] };

  // simulate expensive convex hull calculation
  const faces = await expensiveConvexHullCalculation(vertices);

  self.postMessage({ id, faces });
};

async function expensiveConvexHullCalculation(vertices: number[][]): Promise<number[][]> {
  // placeholder for real convex hull computation
  await new Promise((r) => setTimeout(r, 200)); // simulate delay
  return vertices.map((_, i) => [i, (i + 1) % vertices.length]); // fake faces
}