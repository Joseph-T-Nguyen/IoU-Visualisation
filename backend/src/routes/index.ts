import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import WorkspaceRoutes from './workspaces';
import AuthRoutes from './auth';
import { verifyAuth } from '@src/middleware/auth';


/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();



// Auth
const authRouter = Router();
authRouter.post('/login', AuthRoutes.login);
authRouter.get('/verify', AuthRoutes.verify);
apiRouter.use('/auth', authRouter);

// Workspaces
const workspacesRouter = Router();
workspacesRouter.get(Paths.Workspaces.List, verifyAuth, WorkspaceRoutes.list);
workspacesRouter.get(Paths.Workspaces.GetById, WorkspaceRoutes.getById);
workspacesRouter.put(Paths.Workspaces.Update, WorkspaceRoutes.update);
workspacesRouter.post(Paths.Workspaces.Create, verifyAuth, WorkspaceRoutes.create);
workspacesRouter.post(Paths.Workspaces.Duplicate, WorkspaceRoutes.duplicate);
workspacesRouter.post(Paths.Workspaces.Save, WorkspaceRoutes.save);
apiRouter.use(Paths.Workspaces.Base, workspacesRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
