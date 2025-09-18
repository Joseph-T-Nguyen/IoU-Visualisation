/* eslint-disable no-console */
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Deterministic PRNG (mulberry32)
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Use fixed seed or override via SEED env var
const SEED = Number(process.env.SEED ?? 123456);
const rand = mulberry32(SEED);

function randomVertices(count: number) {
  const verts: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    verts.push([
      parseFloat((rand() * 5).toFixed(3)),
      parseFloat((rand() * 5).toFixed(3)),
      parseFloat((rand() * 5).toFixed(3)),
    ]);
  }
  return verts;
}

async function main() {
  // Clean slate for repeatable seeds
  await prisma.shape.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const users = await prisma.$transaction([
    prisma.user.create({ data: { name: 'Alice' } }),
    prisma.user.create({ data: { name: 'Bob' } }),
    prisma.user.create({ data: { name: 'Charlie' } }),
  ]);

  const colorPalette = ['#ef4444', '#10b981', '#0ea5e9', '#f59e0b', '#a855f7'];

  // For each user, create 2 workspaces, each with 1-3 shapes
  for (const user of users) {
    for (let w = 1; w <= 2; w++) {
      const ws = await prisma.workspace.create({
        data: {
          name: `${user.name ?? 'User'} Workspace ${w}`,
          ownerId: user.id,
        },
      });

      const shapeCount = 1 + Math.floor(rand() * 3);
      for (let s = 0; s < shapeCount; s++) {
        await prisma.shape.create({
          data: {
            name: `Shape ${s + 1}`,
            color: colorPalette[(s + w) % colorPalette.length],
            vertices: randomVertices(8),
            workspaceId: ws.id,
          },
        });
      }
    }
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


