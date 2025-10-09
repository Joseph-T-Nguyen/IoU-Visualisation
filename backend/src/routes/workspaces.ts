import { Request, Response, NextFunction } from 'express';
import * as WorkspaceRepo from '@src/repos/WorkspaceRepo';

export default {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String((req.query.userId ?? '1'));
      const rows = await WorkspaceRepo.findByOwner(userId);
      const workspaces = rows.map(r => ({
        id: r.id,
        name: r.name,
        lastEdited: `Edited ${r.updatedAt.toLocaleDateString()}`,
      }));
      res.set('Cache-Control', 'no-store');
      return res.json({ userId, workspaces });
    } catch (err) {
      return next(err);
    }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const ws = await WorkspaceRepo.findWithShapes(id);
      if (!ws) return res.status(404).json({ error: 'Workspace not found' });
      const shapesMap: Record<string, any> = {};
      for (const s of ws.shapes) {
        shapesMap[s.id] = {
          name: s.name,
          color: s.color,
          vertices: s.vertices as number[][],
        };
      }
      res.set('Cache-Control', 'no-store');
      return res.json({ workspace: { id: ws.id, name: ws.name, shapes: shapesMap } });
    } catch (err) {
      return next(err);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { name } = req.body as { name?: string };
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const updated = await WorkspaceRepo.updateName(id, name.trim());
      return res.json({ id: updated.id, name: updated.name, lastEdited: `Edited ${updated.updatedAt.toLocaleDateString()}` });
    } catch (err) {
      return next(err);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId, name } = req.body as { ownerId?: string, name?: string };
      if (!ownerId) return res.status(400).json({ error: 'ownerId is required' });
      if (!name || name.trim().length === 0) return res.status(400).json({ error: 'name is required' });
      const created = await WorkspaceRepo.createWorkspace(ownerId, name.trim());
      res.set('Cache-Control', 'no-store');
      return res.status(201).json({ id: created.id, name: created.name, lastEdited: `Edited ${created.updatedAt.toLocaleDateString()}` });
    } catch (err) {
      return next(err);
    }
  },
  async duplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const created = await WorkspaceRepo.duplicateWorkspace(id);
      if (!created) return res.status(404).json({ error: 'Workspace not found' });
      res.set('Cache-Control', 'no-store');
      return res.status(201).json({ id: created.id, name: created.name, lastEdited: `Edited ${new Date().toLocaleDateString()}` });
    } catch (err) {
      return next(err);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await WorkspaceRepo.deleteWorkspace(id);
      res.set('Cache-Control', 'no-store');
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  },
  async updateShapes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { shapes } = req.body as { shapes?: Record<string, { name: string; color: string; vertices: number[][] }> };
      if (!shapes) return res.status(400).json({ error: 'shapes is required' });
      await WorkspaceRepo.updateShapes(id, shapes);
      res.set('Cache-Control', 'no-store');
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  },
};


