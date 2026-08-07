export interface RequestUser {
  sub: string;
  email: string;
  roleIds: string[];
  /** Nombres de rol ('admin', 'instructor', …). Opcional: los tokens emitidos
   *  antes de que se añadiera este campo no lo traen. */
  roles?: string[];
  permissions: string[];
  scope: 'authenticated_user' | 'api_user' | 'database_user' | 'anonymous';
}
