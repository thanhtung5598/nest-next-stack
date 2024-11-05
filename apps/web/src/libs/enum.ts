export enum ROUTE {
  LOGIN = '/',
  LOGOUT = '/logout',

  AUTH = '/OAuth',

  DASHBOARD = '/dashboard',
  DEVICES = '/devices',
  CREATE_DEVICE = '/devices/create',
  USERS = '/users',

  BRANDS = '/brands',
  CATEGORIES = '/categories',
  DEPARTMENTS = '/departments',

  USER_DETAIL = '/users/[userId]',
  USER_DEVICES = '/users/[userId]/devices',

  PROFILE = '/profile',
  PROFILE_USER_DEVICES = '/profile/user-devices',
  PROFILE_USER_BORROW_DEVICES = '/profile/user-borrow-devices',
  PROFILE_USER_BORROW_HISTORY = '/profile/user-borrow-history',

  BORROW_REQUEST = 'borrow-request',
  BORROW_HISTORY = 'borrow-history',
}

export enum COOKIE_KEYS {
  TOKEN = 'x-access-token',
}
