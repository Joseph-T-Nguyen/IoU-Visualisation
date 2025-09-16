
export default {
  Base: '/api',
  Root: '/',
  Me: '/me',
  Bootstrap: '/bootstrap',
  Workspaces: {
    Base: '/workspaces',
    List: '/',
    GetById: '/:id',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
