export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInQueryResult {
  signIn: JwtTokens;
}

export interface AccessTokenData {
  iat: number;
  exp: number;
  username: string;
}

export interface AccessTokenQueryResult {
  accessTokenByRefreshToken: string;
}
