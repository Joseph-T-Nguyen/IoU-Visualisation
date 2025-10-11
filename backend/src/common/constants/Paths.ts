
export default {
  Base: '/api',
  Root: '/',
  Me: '/me',
  Bootstrap: '/bootstrap',
  Workspaces: {
    Base: '/workspaces',
    List: '/',
    GetById: '/:id',
    Update: '/:id',
    Create: '/',
    Duplicate: '/:id/duplicate',
    Save: '/:id/save',
    Delete: '/:id',
  },
} as const;
