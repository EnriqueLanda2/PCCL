export type ActorScope =
  | 'authenticated_user'
  | 'api_user'
  | 'database_user'
  | 'anonymous';

export interface RequestUser {
  sub: string;
  email: string;
  roleIds: string[];
  permissions: string[];
  scope: ActorScope;
}
