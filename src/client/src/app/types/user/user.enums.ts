export enum UserRole {
  User, // Authenticated user with read / write permissions
  Viewer, // Authenticated user with read permissions
  Guest, // Unauthenticated user
}
