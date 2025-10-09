"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const WorkspaceRepo = __importStar(require("@src/repos/WorkspaceRepo"));
exports.default = {
    async list(req, res, next) {
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
        }
        catch (err) {
            return next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const ws = await WorkspaceRepo.findWithShapes(id);
            if (!ws)
                return res.status(404).json({ error: 'Workspace not found' });
            const shapesMap = {};
            for (const s of ws.shapes) {
                shapesMap[s.id] = {
                    name: s.name,
                    color: s.color,
                    vertices: s.vertices,
                };
            }
            res.set('Cache-Control', 'no-store');
            return res.json({ workspace: { id: ws.id, name: ws.name, shapes: shapesMap } });
        }
        catch (err) {
            return next(err);
        }
    },
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            if (!name || name.trim().length === 0) {
                return res.status(400).json({ error: 'Name is required' });
            }
            const updated = await WorkspaceRepo.updateName(id, name.trim());
            return res.json({ id: updated.id, name: updated.name, lastEdited: `Edited ${updated.updatedAt.toLocaleDateString()}` });
        }
        catch (err) {
            return next(err);
        }
    },
    async create(req, res, next) {
        try {
            const { ownerId, name } = req.body;
            if (!ownerId)
                return res.status(400).json({ error: 'ownerId is required' });
            if (!name || name.trim().length === 0)
                return res.status(400).json({ error: 'name is required' });
            const created = await WorkspaceRepo.createWorkspace(ownerId, name.trim());
            res.set('Cache-Control', 'no-store');
            return res.status(201).json({ id: created.id, name: created.name, lastEdited: `Edited ${created.updatedAt.toLocaleDateString()}` });
        }
        catch (err) {
            return next(err);
        }
    },
    async duplicate(req, res, next) {
        try {
            const { id } = req.params;
            const created = await WorkspaceRepo.duplicateWorkspace(id);
            if (!created)
                return res.status(404).json({ error: 'Workspace not found' });
            res.set('Cache-Control', 'no-store');
            return res.status(201).json({ id: created.id, name: created.name, lastEdited: `Edited ${new Date().toLocaleDateString()}` });
        }
        catch (err) {
            return next(err);
        }
    },
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await WorkspaceRepo.deleteWorkspace(id);
            res.set('Cache-Control', 'no-store');
            return res.status(204).send();
        }
        catch (err) {
            return next(err);
        }
    },
    async updateShapes(req, res, next) {
        try {
            const { id } = req.params;
            const { shapes } = req.body;
            if (!shapes)
                return res.status(400).json({ error: 'shapes is required' });
            await WorkspaceRepo.updateShapes(id, shapes);
            res.set('Cache-Control', 'no-store');
            return res.status(204).send();
        }
        catch (err) {
            return next(err);
        }
    },
};
