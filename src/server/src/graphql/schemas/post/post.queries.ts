import {gql, UserInputError} from 'apollo-server-express';
import {IUser} from '../../../types/user/user.interfaces';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPost} from '../../../types/post/post.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {USER_ID_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {Post} from '../../../models/post';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {SortOrder} from '../../../types/shared/shared.enums';
import mongoose from 'mongoose';

// TODO inspect Post null issue
export const postQueryTypeDefinitions = gql`
  extend type Query {
    postsByUserId(userId: String!, parameters: RequestParameters!): PostByUserId
    postsByUsername(username: String!, order: SortOrder): [Post!]!
  }
`;

const postsByUserId = async (
  _: unknown,
  {
    userId,
    parameters,
  }: {userId: ILinkard['userId']; parameters: {order: SortOrder; offset: number; limit: number}},
): Promise<Array<MongooseDocument<IPost>> | {data: any; total: any} | null> => {
  const {isValidData} = checkDataValidity({
    data: {userId, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      userId: USER_ID_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isSafeInteger,
      limit: Number.isSafeInteger,
    },
  });

  if (!isValidData) return null;

  // const dataval = checkDataValidity({
  //   data: {userId: {userId: userId}, chill: 4},
  //   pattern: {'userId.userId': USER_ID_REGEXP},
  // });
  // console.log(dataval);
  // const response = await Post.aggregate()
  //   .match({userId: mongoose.Types.ObjectId(userId)})
  //   .facet({
  //     data: [{$skip: 0}, {$limit: 2}],
  //     total: [{$count: 'total'}],
  //   });

  // const shapeAggregated = (response: any) => {
  //   if (!response.length) return {};
  //   console.log(response[0].total);
  //   return {
  //     data: response[0].data,
  //     total: response[0].total[0].total,
  //   };
  // };

  // const cursor = () =>
  //   Post.find({
  //     userId,
  //   });

  const aggregationResult = await Post.aggregate([
    {$match: {userId: mongoose.Types.ObjectId(userId)}},
    {
      $facet: {
        data: [
          {$limit: parameters.limit},
          parameters.offset ? {$skip: parameters.offset} : null,
          // parameters.limit ? {$limit: parameters.limit} : null,
          parameters.order
            ? {$sort: {createdAt: parameters.order === SortOrder.ASCENDING ? 1 : -1}}
            : null,
        ].filter((stage) => stage), // Filter null
        total: [{$count: 'total'}],
      },
    },
  ]);

  const data = aggregationResult[0].data;

  // const uniqueUserIds = data.map((post) => post.userId);

  return {
    data: data,
    total: aggregationResult[0].total[0].total,
  };

  // const cursor = PostByUserId();
  // console.log(
  //
  // );

  // return Post.aggregate([
  //   {
  //     // $facet: {postsByUserId: [{$match: {userId}}], total: [{$count: 'total'}]},
  //     $facet: {data: [{$match: {userId}}]},
  //   },
  // ]);
  //
  // console.log('sort ', await cursor.sort({createdAt: order}));
  // if (parameters) {
  //   let mutableCursor = cursor();
  //
  //   // if (parameters.order) mutableCursor = mutableCursor.sort({createdAt: parameters.order});
  //   // if (parameters.offset) mutableCursor = mutableCursor.skip(parameters.offset);
  //   if (parameters.limit) mutableCursor = mutableCursor.limit(parameters.offset);
  //
  //   return {
  //     data: await mutableCursor,
  //     total: await cursor().countDocuments(),
  //   };
  // }
  //
  // return cursor();
};

const postsByUsername = async (
  _: unknown,
  {username, order}: {username: IUser['username']; order: SortOrder},
): Promise<Array<MongooseDocument<IPost>> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (!isValidData) return null;

  const user = await User.findOne({
    username,
  });

  if (!user) return new UserInputError('Invalid username');

  const cursor = Post.find({
    userId: user._id,
  });

  if (order) {
    return cursor.sort({createdAt: order});
  }

  return cursor;
};

export const postQueryResolvers = {
  Query: {
    postsByUserId,
    postsByUsername,
  },
};
