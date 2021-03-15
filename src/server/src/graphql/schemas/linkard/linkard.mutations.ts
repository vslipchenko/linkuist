import {ApolloError, gql} from 'apollo-server-express';
import {authenticationInterceptor} from '../../../utilities/interceptors';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {AccessTokenData} from '../../../types/jwt/jwt.interfaces';
import {Linkard} from '../../../models/linkard';

const createLinkard = (
  _: unknown,
  {input}: {input: Omit<ILinkard, 'userId'>},
  {accessToken}: {accessToken: string},
): any => {
  return authenticationInterceptor<Promise<any> | ApolloError>(
    accessToken,
    async ({userId}: AccessTokenData) => {
      // TODO Bookmark input validation
      // try {
      //   new URL(input.link);
      // } catch (error) {
      //   return new ApolloError(''); // Pre-validates on the client
      // }
      console.log('create linkard input ', userId, input);

      // const isValidBookmark = checkDataValidity({input, pattern: /wa/});
      //
      // if (!isValidBookmark) { // assume UI validation was passed
      //   return new ApolloError('');
      // }

      // const nullishProperties = getNullishProperties<IgnoreMetadataProperties>(input, ['title', 'description', 'image', 'icon']);

      // const metadata = await fetchUrlMetadata(input.link, nullishProperties);

      // return new Promise((resolve) => resolve);
      return Linkard.create({
        ...input,
        // ...metadata,
        userId,
      });
    },
  );
};

export const linkardMutationTypeDefinitions = gql`
  extend type Mutation {
    createLinkard(input: CreateLinkardMutationInput!): Linkard
  }
`;

export const linkardMutationResolvers = {
  Mutation: {
    createLinkard,
  },
};
