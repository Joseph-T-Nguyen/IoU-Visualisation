
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
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
