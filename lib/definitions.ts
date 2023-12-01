export type UserAuthType = {
  id: string;
  username: string;
  password: string;
  role: string;
};

export type UserType = Omit<UserAuthType, 'password'> & {
  logs?: string[];
  books?: string[];
  requests?: string[];
};

export type CreateBookType = Omit<BookType, 'id' | 'borrowed' | 'requested'>;

export type BookType = {
  id: string;
  title: string;
  author: string;
  borrowerid?: string;
  requestid?: string;
  borrowername?: string;
};

export type LogType = {
  id: string;
  createdat: Date;
  permission: string;
  userid: string;
  username: string;
  affecteduser?: UserType;
  newuser?: UserType;
  affecteduserid?: string;
  affectedbook?: BookType;
  newbook?: BookType;
  affectedbookid?: string;
  affectedrequest?: RequestType;
  affectedrequestid?: string;
};

export type RequestType = {
  id: string;
  requestname: 'REQUEST_BOOK' | 'RETURN_BOOK';
  userid: string;
  username: string;
  bookid: string;
  booktitle: string;
};

export type WritepermissionnameType =
  | 'DELETE_BOOK'
  | 'UPDATE_BOOK'
  | 'CREATE_BOOK'
  | 'CHECKIN_BOOK'
  | 'CHECKOUT_BOOK'
  | 'ADD_USER'
  | 'DELETE_USER'
  | 'RETURN_BOOK'
  | 'REVOKE_RETURN_BOOK'
  | 'REQUEST_BOOK'
  | 'REVOKE_REQUEST_BOOK'
  | 'UPDATE_PROFILE'
  | 'DELETE_PROFILE'
  | 'REGISTERED';
export type ReadpermissionnameType = 'VIEW_USER';

export type PermissionType = {
  permissionname: WritepermissionnameType | ReadpermissionnameType;
  roles: string[];
  logids?: string[];
};

export type RoleType = {
  rolename: 'ADMIN' | 'USER';
  permissions: string[];
  userids?: string[];
};
