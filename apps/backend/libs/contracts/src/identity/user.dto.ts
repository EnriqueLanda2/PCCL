export interface RequestUser {
  sub: string;
  email: string;
  roleIds: string[];
  permissions: string[];
  scope: 'authenticated_user' | 'api_user' | 'database_user' | 'anonymous';
}

export interface MsgContext {
  user: RequestUser | null;
}

export interface LoginPayload extends MsgContext {
  email: string;
  password: string;
}

export interface RegisterPayload extends MsgContext {
  fullName: string;
  email: string;
  password: string;
}

export interface UserFindByIdPayload extends MsgContext {
  id: string;
}

export interface CreateUserPayload extends MsgContext {
  fullName: string;
  email: string;
  password: string;
  roleIds: string[];
}

export interface PushTokenRegisterPayload {
  userId: string;
  token: string;
}

export interface PushNotifyUsersPayload {
  userIds: string[];
  title: string;
  body: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
