
export default {
  Base: '/api',
  Root: '/',
  Me: '/me',
  Bootstrap: '/bootstrap',
  Workspaces: {
    Base: '/workspaces',
    List: '/',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
