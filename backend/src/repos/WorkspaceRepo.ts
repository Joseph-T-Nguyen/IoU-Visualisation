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

export async function updateName(workspaceId: string, name: string) {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data: { name },
    select: { id: true, name: true, updatedAt: true },
  });
}

export async function createWorkspace(ownerId: string, name: string) {
  return prisma.workspace.create({
    data: { ownerId, name },
    select: { id: true, name: true, updatedAt: true },
  });
}

export async function duplicateWorkspace(sourceWorkspaceId: string) {
  const src = await prisma.workspace.findUnique({
    where: { id: sourceWorkspaceId },
    include: { shapes: true },
  });
  if (!src) return null;

  const newName = `${src.name} (copy)`;

  return prisma.$transaction(async (tx) => {
    const created = await tx.workspace.create({
      data: { ownerId: src.ownerId, name: newName },
    });
    if (src.shapes.length > 0) {
      await tx.shape.createMany({
        data: src.shapes.map(s => ({
          name: s.name,
          color: s.color,
          vertices: s.vertices,
          workspaceId: created.id,
        })),
      });
    }
    return created;
  });
}

export async function deleteWorkspace(workspaceId: string) {
  return prisma.$transaction(async (tx) => {
    // Delete all shapes first
    await tx.shape.deleteMany({
      where: { workspaceId },
    });
    // Then delete the workspace
    return tx.workspace.delete({
      where: { id: workspaceId },
    });
  });
}

export async function updateShapes(workspaceId: string, shapes: Record<string, { name: string; color: string; vertices: number[][] }>) {
  return prisma.$transaction(async (tx) => {
    // Delete all existing shapes for this workspace
    await tx.shape.deleteMany({
      where: { workspaceId },
    });

    // Create new shapes
    const shapeEntries = Object.entries(shapes);
    if (shapeEntries.length > 0) {
      await tx.shape.createMany({
        data: shapeEntries.map(([id, shape]) => ({
          id,
          name: shape.name,
          color: shape.color,
          vertices: shape.vertices as any,
          workspaceId,
        })),
      });
    }

    // Update the workspace's updatedAt timestamp
    await tx.workspace.update({
      where: { id: workspaceId },
      data: { updatedAt: new Date() },
    });
  });
}


