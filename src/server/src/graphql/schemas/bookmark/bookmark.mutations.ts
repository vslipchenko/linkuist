import {ApolloError, gql} from 'apollo-server-express';
import {IBookmark} from '../../../types/bookmark/bookmark.interfaces';
import {authenticationInterceptor} from '../../../utilities/interceptors';
import {AccessTokenData} from '../../../types/jwt/jwt.interfaces';
// import { checkDataValidity } from '../../../utilities/validators';
import {Bookmark} from '../../../models/bookmark';
// import { getNullishProperties } from '../../../utilities/getters';
// import { fetchUrlMetadata, IgnoreMetadataProperties } from '../../../utilities/url-metadata';
// import {RefreshAccessTokenPayload} from '../../../types/jwt/jwt.interfaces';
// import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
// import {IBookmark} from '../../../types/bookmark/bookmark.interfaces';

const createBookmark = (
  _: unknown,
  {input}: {input: Omit<IBookmark, 'userId'>},
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
      console.log('create bookmark input ', userId, input);

      // const isValidBookmark = checkDataValidity({input, pattern: /wa/});
      //
      // if (!isValidBookmark) { // assume UI validation was passed
      //   return new ApolloError('');
      // }

      // const nullishProperties = getNullishProperties<IgnoreMetadataProperties>(input, ['title', 'description', 'image', 'icon']);

      // const metadata = await fetchUrlMetadata(input.link, nullishProperties);

      // return new Promise((resolve) => resolve);
      return Bookmark.create({
        ...input,
        // ...metadata,
        userId,
      });
    },
  );
};

export const bookmarkMutationTypeDefinitions = gql`
  extend type Mutation {
    createBookmark(input: CreateBookmarkMutationInput!): Bookmark
  }
`;

export const bookmarkMutationResolvers = {
  Mutation: {
    createBookmark,
  },
};
