"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Paths_1 = __importDefault(require("@src/common/constants/Paths"));
const workspaces_1 = __importDefault(require("./workspaces"));
/******************************************************************************
                                Setup
******************************************************************************/
const apiRouter = (0, express_1.Router)();
// Workspaces
const workspacesRouter = (0, express_1.Router)();
workspacesRouter.get(Paths_1.default.Workspaces.List, workspaces_1.default.list);
workspacesRouter.post(Paths_1.default.Workspaces.Create, workspaces_1.default.create);
workspacesRouter.post(Paths_1.default.Workspaces.Duplicate, workspaces_1.default.duplicate);
workspacesRouter.get(Paths_1.default.Workspaces.GetById, workspaces_1.default.getById);
workspacesRouter.put(Paths_1.default.Workspaces.Update, workspaces_1.default.update);
workspacesRouter.put(Paths_1.default.Workspaces.UpdateShapes, workspaces_1.default.updateShapes);
workspacesRouter.delete(Paths_1.default.Workspaces.Delete, workspaces_1.default.delete);
apiRouter.use(Paths_1.default.Workspaces.Base, workspacesRouter);
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = apiRouter;
