"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByOwner = findByOwner;
exports.findWithShapes = findWithShapes;
exports.updateName = updateName;
exports.createWorkspace = createWorkspace;
exports.duplicateWorkspace = duplicateWorkspace;
exports.deleteWorkspace = deleteWorkspace;
exports.updateShapes = updateShapes;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function findByOwner(ownerId) {
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
async function findWithShapes(workspaceId) {
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
async function updateName(workspaceId, name) {
    return prisma.workspace.update({
        where: { id: workspaceId },
        data: { name },
        select: { id: true, name: true, updatedAt: true },
    });
}
async function createWorkspace(ownerId, name) {
    return prisma.workspace.create({
        data: { ownerId, name },
        select: { id: true, name: true, updatedAt: true },
    });
}
async function duplicateWorkspace(sourceWorkspaceId) {
    const src = await prisma.workspace.findUnique({
        where: { id: sourceWorkspaceId },
        include: { shapes: true },
    });
    if (!src)
        return null;
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
async function deleteWorkspace(workspaceId) {
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
async function updateShapes(workspaceId, shapes) {
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
                    vertices: shape.vertices,
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
