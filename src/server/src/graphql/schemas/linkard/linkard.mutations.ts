import {ApolloError, gql} from 'apollo-server-express';
import {ILinkard} from '@typings/linkard/linkard.interfaces';
import {authenticationInterceptor} from '@utilities/interceptors';
import {AccessTokenData} from '@typings/jwt/jwt.interfaces';
// import { checkDataValidity } from '../../../utilities/validators';
import {Linkard} from '@models/linkard';
// import { getNullishProperties } from '../../../utilities/getters';
// import { fetchUrlMetadata, IgnoreMetadataProperties } from '../../../utilities/url-metadata';
// import {RefreshAccessTokenPayload} from '../../../types/jwt/jwt.interfaces';
// import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
// import {IBookmark} from '../../../types/linkard/linkard.interfaces';

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
