import { Request, Response, NextFunction } from 'express';

export default {
  async list(_: Request, res: Response, next: NextFunction) {
    try {
      const data = [
        { id: '1', name: 'Workspace 1', lastEdited: 'Edited 8/5/2025', previewImage: 'green' },
        { id: '2', name: 'Workspace 2', lastEdited: 'Edited 8/5/2025', previewImage: 'red' },
        { id: '3', name: 'Workspace 3', lastEdited: 'Edited 8/5/2025' },
      ];
      return res.json({ workspaces: data });
    } catch (err) {
      return next(err);
    }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      // Static default workspace context (shapes keyed by UUID)
      const workspace = {
        id,
        name: 'Default Workspace',
        shapes: {
          '11111111-1111-1111-1111-111111111111': {
            name: 'Shape 1',
            color: '#ef4444',
            vertices: [
              [0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0],
              [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1],
            ],
            faces: [],
          },
          '22222222-2222-2222-2222-222222222222': {
            name: 'Shape 2',
            color: '#10b981',
            vertices: [
              [2, 0, 0], [2, 1, 0], [3, 0, 0], [3, 1, 0],
              [2, 0, 1], [2, 1, 1], [3, 0, 1], [3, 1, 1],
            ],
            faces: [],
          },
          '32222222-2222-2222-2222-222222222222': {
            name: 'Shape 3',
            color: '#111111',
            vertices: [
              [3, 0, 0], [3, 2, 0], [6, 0, 0], [6, 3, 0],
              [3, 0, 3], [3, 2, 2], [6, 0, 2], [6, 3, 6],
            ],
            faces: [],
          },
        },
      };
      return res.json({ workspace });
    } catch (err) {
      return next(err);
    }
  },
};


