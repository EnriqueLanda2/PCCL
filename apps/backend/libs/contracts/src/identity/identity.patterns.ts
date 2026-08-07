export const IDENTITY_PATTERNS = {
  AUTH_LOGIN: 'identity.auth.login',
  AUTH_REGISTER: 'identity.auth.register',
  USER_FIND_ALL: 'identity.user.find_all',
  USER_FIND_BY_ID: 'identity.user.find_by_id',
  USER_CREATE: 'identity.user.create',
  USER_COUNT_ACTIVE: 'identity.user.count_active',
  USER_UPDATE_AVATAR: 'identity.user.update_avatar',
  RBAC_PROFILE: 'identity.rbac.profile',
  RBAC_CATALOGS: 'identity.rbac.catalogs',
} as const;
