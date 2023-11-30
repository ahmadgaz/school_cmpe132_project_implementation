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
    userids: ['9f38c852-0614-4299-9cc0-6853bf5a4b37'],
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
    userids: ['80dd3724-3306-434a-aa35-3eb49a600493'],
  },
];

const permissions = [
  {
    permissionname: 'DELETE_BOOK',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'UPDATE_BOOK',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'CREATE_BOOK',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'CHECKIN_BOOK',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'CHECKOUT_BOOK',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'ADD_USER',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'DELETE_USER',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'VIEW_LOGS',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'VIEW_USER',
    roles: ['ADMIN'],
    logids: [],
  },
  {
    permissionname: 'RETURN_BOOK',
    roles: ['USER', 'ADMIN'],
    logids: [],
  },
  {
    permissionname: 'REVOKE_RETURN_BOOK',
    roles: ['USER', 'ADMIN'],
    logids: [],
  },
  {
    permissionname: 'REQUEST_BOOK',
    roles: ['USER', 'ADMIN'],
    logids: [],
  },
  {
    permissionname: 'REVOKE_REQUEST_BOOK',
    roles: ['USER', 'ADMIN'],
    logids: [],
  },
  {
    permissionname: 'UPDATE_PROFILE',
    roles: ['USER'],
    logids: [],
  },
  {
    permissionname: 'DELETE_PROFILE',
    roles: ['USER'],
    logids: [],
  },
  {
    permissionname: 'REGISTERED',
    roles: ['USER'],
    logids: [],
  },
];

const users = [
  {
    id: '9f38c852-0614-4299-9cc0-6853bf5a4b37',
    role: 'ADMIN',
    username: 'admin',
    password: 'password',
    logids: [],
    bookids: [],
    requestids: [],
  },
  {
    id: '80dd3724-3306-434a-aa35-3eb49a600493',
    role: 'USER',
    username: 'user',
    password: 'password',
    logids: [],
    bookids: [],
    requestids: [],
  },
];

const books = [
  {
    id: 'fdcbfc6e-8d84-11ee-b9d1-0242ac120002',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    borrowerid: '80dd3724-3306-434a-aa35-3eb49a600493',
  },
  {
    id: '1a6f811a-8d85-11ee-b9d1-0242ac120002',
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
  },
  {
    id: '1f6d5c50-8d85-11ee-b9d1-0242ac120002',
    title: 'The Two Towers',
    author: 'J.R.R. Tolkien',
  },
  {
    id: '22938cba-8d85-11ee-b9d1-0242ac120002',
    title: 'The Return of the King',
    author: 'J.R.R. Tolkien',
  },
  {
    id: '2f442e1a-8d85-11ee-b9d1-0242ac120002',
    title: 'Moby-Dick',
    author: 'Herman Melville',
  },
  {
    id: '321520b8-8d85-11ee-b9d1-0242ac120002',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
  },
  {
    id: '346c8ee6-8d85-11ee-b9d1-0242ac120002',
    title: 'To the Lighthouse',
    author: 'Virginia Woolf',
  },
  {
    id: '36aca4ac-8d85-11ee-b9d1-0242ac120002',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    borrowerid: '80dd3724-3306-434a-aa35-3eb49a600493',
  },
  {
    id: '39cf7f92-8d85-11ee-b9d1-0242ac120002',
    title: 'The Chronicles of Narnia',
    author: 'C.S. Lewis',
  },
  {
    id: '3d2257fa-8d85-11ee-b9d1-0242ac120002',
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
  },
  {
    id: '400d4812-8d85-11ee-b9d1-0242ac120002',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    borrowerid: '9f38c852-0614-4299-9cc0-6853bf5a4b37',
  },
];

module.exports = {
  roles,
  permissions,
  users,
  books,
};
