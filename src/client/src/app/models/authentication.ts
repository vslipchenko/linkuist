export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInQueryResult {
  signIn: JwtTokens;
}
