export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInQueryResult {
  signIn: JwtTokens;
}

export interface AccessTokenData {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export interface AccessTokenQueryResult {
  accessTokenByRefreshToken: string;
}
