import {ApolloError, gql} from 'apollo-server-express';
import {BookmarkDocument, IBookmark} from '../../../types/bookmark/bookmark.interfaces';
import {authenticationInterceptor} from '../../../utilities/interceptors';
import {Bookmark} from '../../../models/bookmark';
import {AccessTokenData} from '../../../types/jwt/jwt.interfaces';
// import {RefreshAccessTokenPayload} from '../../../types/jwt/jwt.interfaces';
// import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
// import {IBookmark} from '../../../types/bookmark/bookmark.interfaces';

const createBookmark = (
  _: unknown,
  {input}: {input: Omit<IBookmark, 'userId'>},
  {accessToken}: {accessToken: string}
) => {
  return authenticationInterceptor<Promise<BookmarkDocument> | ApolloError>(accessToken, ({userId}: AccessTokenData) => {
    // TODO Bookmark input validation
    // try {
    //   new URL(input.link);
    // } catch (error) {
    //   return new ApolloError(''); // Pre-validates on the client
    // }

    return Bookmark.create({
      ...input,
      userId
    });
  });
};

export const bookmarkMutationTypeDefinitions = gql`
    extend type Mutation {
        createBookmark(input: CreateBookmarkMutationInput!): Bookmark
    }
`;

export const bookmarkMutationResolvers = {
  Mutation: {
    createBookmark
  }
};
