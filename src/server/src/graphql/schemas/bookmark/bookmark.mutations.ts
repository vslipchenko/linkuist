import {gql} from 'apollo-server-express';
// import {BookmarkInterface} from '../../../types/bookmark/bookmark.interfaces';

// const createBookmark = (_: unknown, {input}: {input: Omit<BookmarkInterface, 'userId'>}) => {
//
// };

// TODO server side validation
export const bookmarkMutationTypeDefinitions = gql`
    extend type Mutation {
        createBookmark(input: CreateBookmarkMutationInput!): Bookmark!
    }
`;

export const bookmarkMutationResolvers = {
  Mutation: {
    createBookmark: () => {}
  }
};
