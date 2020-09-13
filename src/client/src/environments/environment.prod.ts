export class Environment {
  static readonly production = true;
  static readonly apiHost = 'http://localhost:4300';
  static readonly graphqlUri = Environment.apiHost + '/graphql';
}
