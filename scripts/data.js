const roles = [
  {
    rolename: 'ADMIN',
    permissions: [
      'DELETE_BOOK',
      'UPDATE_BOOK',
      'CREATE_BOOK',
      'CHECKIN_BOOK',
      'CHECKOUT_BOOK',
      'ADD_USER',
      'DELETE_USER',
      'VIEW_LOGS',
      'VIEW_USER',
      'RETURN_BOOK',
      'REVOKE_RETURN_BOOK',
      'REQUEST_BOOK',
      'REVOKE_REQUEST_BOOK',
    ],
  },
  {
    rolename: 'USER',
    permissions: [
      'RETURN_BOOK',
      'REVOKE_RETURN_BOOK',
      'REQUEST_BOOK',
      'REVOKE_REQUEST_BOOK',
      'UPDATE_PROFILE',
      'DELETE_PROFILE',
    ],
  },
];

const permissions = [
  {
    permissionname: 'DELETE_BOOK',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'UPDATE_BOOK',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'CREATE_BOOK',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'CHECKIN_BOOK',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'CHECKOUT_BOOK',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'ADD_USER',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'DELETE_USER',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'VIEW_LOGS',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'VIEW_USER',
    roles: ['ADMIN'],
  },
  {
    permissionname: 'RETURN_BOOK',
    roles: ['USER', 'ADMIN'],
  },
  {
    permissionname: 'REVOKE_RETURN_BOOK',
    roles: ['USER', 'ADMIN'],
  },
  {
    permissionname: 'REQUEST_BOOK',
    roles: ['USER', 'ADMIN'],
  },
  {
    permissionname: 'REVOKE_REQUEST_BOOK',
    roles: ['USER', 'ADMIN'],
  },
  {
    permissionname: 'UPDATE_PROFILE',
    roles: ['USER'],
  },
  {
    permissionname: 'DELETE_PROFILE',
    roles: ['USER'],
  },
  {
    permissionname: 'REGISTERED',
    roles: ['USER'],
  },
];

const users = [
  {
    role: 'ADMIN',
    username: 'admin',
    password: 'password',
  },
];

module.exports = {
  roles,
  permissions,
  users,
};
