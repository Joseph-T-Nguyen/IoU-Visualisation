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
          visible: true,
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
          visible: s.visible ?? true, // Default to true if not set
          workspaceId: created.id,
        })),
      });
    }
    return created;
  });
}

export async function saveWorkspace(workspaceId: string, shapes: Record<string, any>) {
  return prisma.$transaction(async (tx) => {
    // Delete existing shapes for this workspace
    await tx.shape.deleteMany({
      where: { workspaceId },
    });

    // Create new shapes from the provided data
    if (Object.keys(shapes).length > 0) {
      await tx.shape.createMany({
        data: Object.entries(shapes).map(([shapeId, shapeData]) => ({
          id: shapeId,
          name: shapeData.name,
          color: shapeData.color,
          vertices: shapeData.vertices,
          visible: shapeData.visible ?? true, // Default to true if not set
          workspaceId,
        })),
      });
    }

    // Update the workspace's updatedAt timestamp
    return tx.workspace.update({
      where: { id: workspaceId },
      data: { updatedAt: new Date() },
      select: { id: true, name: true, updatedAt: true },
    });
  });
}


