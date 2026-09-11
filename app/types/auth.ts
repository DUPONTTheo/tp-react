export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  username: string
  roles?: UserRole[]
}
