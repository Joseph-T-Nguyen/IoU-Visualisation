import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import WorkspaceRoutes from './workspaces';


/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();



// Workspaces
const workspacesRouter = Router();
workspacesRouter.get(Paths.Workspaces.List, WorkspaceRoutes.list);
workspacesRouter.post(Paths.Workspaces.Create, WorkspaceRoutes.create);
workspacesRouter.post(Paths.Workspaces.Duplicate, WorkspaceRoutes.duplicate);
workspacesRouter.get(Paths.Workspaces.GetById, WorkspaceRoutes.getById);
workspacesRouter.put(Paths.Workspaces.Update, WorkspaceRoutes.update);
workspacesRouter.delete(Paths.Workspaces.Delete, WorkspaceRoutes.delete);
apiRouter.use(Paths.Workspaces.Base, workspacesRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
