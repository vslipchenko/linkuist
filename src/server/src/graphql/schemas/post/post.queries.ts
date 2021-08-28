import {gql, UserInputError} from 'apollo-server-express';
import {IUser} from '../../../types/user/user.interfaces';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPost} from '../../../types/post/post.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {Post} from '../../../models/post';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {SortOrder} from '../../../types/shared/shared.enums';
import mongoose from 'mongoose';
import {RequestParameters} from '../../../types/shared/shared.types';
import {POST_FETCH_LIMIT} from '../../../constants/post';
// import {getUtcTimestamp} from '../../../utilities/date';
// import {composePostDate} from '../../../utilities/date';

// TODO inspect Post null issue
export const postQueryTypeDefinitions = gql`
  extend type Query {
    postsByUserId(userId: String!, parameters: RequestParameters!): UserPosts
    postsByUsername(username: String!, parameters: RequestParameters!): UserPosts
  }
`;

const aggregatePost = async (
  userId: string,
  parameters: RequestParameters,
): Promise<{
  posts: {data: any; total: any};
  userProfileTeasers: Array<unknown>;
}> => {
  const aggregationResult = await Post.aggregate([
    {$match: {userId: new mongoose.Types.ObjectId(userId)}},
    {
      $facet: {
        data: [
          // parameters.limit ? {$limit: parameters.limit} : null,
          parameters.order
            ? {$sort: {createdAt: parameters.order === SortOrder.ASCENDING ? 1 : -1}}
            : null,
          parameters.offset ? {$skip: parameters.offset} : null,
          {$limit: parameters.limit},
        ].filter((stage) => stage), // Filter null
        total: [{$count: 'total'}],
      },
    },
  ]);

  const data = aggregationResult[0].data as Array<IPost>;
  const uniqueUserIds: Array<string> = [];

  data.forEach((post: IPost & {date?: string}) => {
    // post.date = composePostDate(post.createdAt);

    if (!uniqueUserIds.includes(post.userId)) uniqueUserIds.push(post.userId);
  });

  const userProfileTeasers = uniqueUserIds.length
    ? await User.find(
        {
          _id: {
            $in: uniqueUserIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
        'username profile.avatarUrl',
      )
    : [];
  // console.log('HERE', aggregationResult);
  return {
    posts: {
      data: data,
      total: aggregationResult[0].total.length ? aggregationResult[0].total[0].total : 0,
    },
    userProfileTeasers,
  };
};

const postsByUserId = (
  _: unknown,
  {userId, parameters}: {userId: ILinkard['userId']; parameters: RequestParameters},
): Promise<{posts: {data: any; total: any}; userProfileTeasers: Array<unknown>}> | null => {
  const {isInvalidData} = checkDataValidity({
    data: {userId, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      userId: RECORD_ID_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isInteger,
      limit: (value) => Number.isInteger(value) && value > 0 && value <= POST_FETCH_LIMIT,
    },
  });

  if (isInvalidData) return null;

  return aggregatePost(userId, parameters);
};

const postsByUsername = async (
  _: unknown,
  {username, parameters}: {username: IUser['username']; parameters: RequestParameters},
): Promise<
  | Array<MongooseDocument<IPost>>
  | {posts: {data: any; total: any}; userProfileTeasers: Array<unknown>}
  | UserInputError
  | null
> => {
  const {isInvalidData} = checkDataValidity({
    data: {username, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      username: USERNAME_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isInteger,
      limit: (value) => Number.isInteger(value) && value > 0 && value <= POST_FETCH_LIMIT,
    },
  });

  if (isInvalidData) return null;
  // TODO Consider to pull only required data
  const user = await User.findOne({
    username,
  });

  if (!user) return new UserInputError('Invalid username');

  return aggregatePost(user._id, parameters);
};

export const postQueryResolvers = {
  Query: {
    postsByUserId,
    postsByUsername,
  },
};
