import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function findByOwner(ownerId: string) {
  return prisma.workspace.findMany({
    where: { ownerId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });
}

export async function findWithShapes(workspaceId: string) {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      shapes: {
        select: {
          id: true,
          name: true,
          color: true,
          vertices: true,
        },
      },
    },
  });
}


