export type UserAuthType = {
  id: string;
  username: string;
  password: string;
  role: string;
};

export type UserType = Omit<UserAuthType, 'password'> & {
  logids: string[];
  bookids: string[];
  requestids: string[];
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
};

export type RequestType = {
  id: string;
  requestname: 'REQUEST_BOOK' | 'RETURN_BOOK';
  userid: string;
  bookid: string;
};

export type WritepermissionnameType =
  | 'DELETE_BOOK' // ADMIN
  | 'UPDATE_BOOK' // ADMIN
  | 'CREATE_BOOK' // ADMIN
  | 'CHECKIN_BOOK' // ADMIN
  | 'CHECKOUT_BOOK' // ADMIN
  | 'ADD_USER' // ADMIN
  | 'DELETE_USER' // ADMIN
  | 'RETURN_BOOK' // USER & ADMIN
  | 'REVOKE_RETURN_BOOK' // USER & ADMIN
  | 'REQUEST_BOOK' // USER & ADMIN
  | 'REVOKE_REQUEST_BOOK' // USER & ADMIN
  | 'UPDATE_PROFILE' // USER
  | 'DELETE_PROFILE' // USER
  | 'REGISTERED'; // USER -> Technically Guest, but this permission only gets logged when a Guest registers.
export type ReadpermissionnameType =
  | 'VIEW_LOGS' // ADMIN
  | 'VIEW_USER'; // ADMIN

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
