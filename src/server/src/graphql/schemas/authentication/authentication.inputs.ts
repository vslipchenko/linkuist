import {gql} from 'apollo-server-express';

export const authenticationInputs = gql`
    input SignInQueryInput {
        email: String!
        password: String!
    }
`;
