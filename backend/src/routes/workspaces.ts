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
      return res.json({ workspace: { id: ws.id, name: ws.name, shapes: shapesMap } });
    } catch (err) {
      return next(err);
    }
  },
};


