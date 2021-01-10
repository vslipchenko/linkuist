export interface RefreshAccessTokenPayload {
  userId: string;
  refreshToken: string;
}

export interface AccessTokenData {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}
