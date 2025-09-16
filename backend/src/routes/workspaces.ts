import { Request, Response, NextFunction } from 'express';

export default {
  async list(_: Request, res: Response, next: NextFunction) {
    try {
      const data = [
        { id: '1', name: 'Workspace 1', lastEdited: 'Edited 8/5/2025', previewImage: 'green', versions: [] },
        { id: '2', name: 'Workspace 2', lastEdited: 'Edited 8/5/2025', previewImage: 'red', versions: [] },
        { id: '3', name: 'Workspace 3', lastEdited: 'Edited 8/5/2025', versions: [] },
      ];
      return res.json({ workspaces: data });
    } catch (err) {
      return next(err);
    }
  },
};


