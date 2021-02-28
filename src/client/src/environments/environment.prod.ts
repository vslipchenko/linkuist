export class Environment {
  public static readonly production = true;
  public static readonly apiHost = 'http://localhost:4300';
  public static readonly graphqlUri = Environment.apiHost + '/graphql';
}
