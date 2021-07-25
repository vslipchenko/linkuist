export enum UserRole {
  USER, // Authenticated user with read / write permissions
  VIEWER, // Authenticated user with read permissions
  GUEST, // Unauthenticated user
}
