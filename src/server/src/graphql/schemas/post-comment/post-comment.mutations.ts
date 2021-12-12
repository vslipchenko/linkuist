import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {getUtcTimestamp} from '../../../utilities/date';

// TODO Deletion functionality (should delete both parent comment & related subcomments)

export const postCommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostComment(input: CreatePostCommentMutationInput): PostComment
  }
`;

const createPostComment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, 'postId' | 'body'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostComment> | ApolloError | null> => {
  const {tokenData, error} = await authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input,
    pattern: {
      postId: RECORD_ID_REGEXP,
      commentId: RECORD_ID_REGEXP,
      body: (value: unknown) => typeof value === 'string' && value.length < 3001,
    },
  });

  console.log(isInvalidData, input);

  if (isInvalidData) return null;

  return PostComment.create({...input, userId: tokenData.userId, createdAt: getUtcTimestamp()});
};

export const postCommentMutationResolvers = {
  Mutation: {
    createPostComment,
  },
};
