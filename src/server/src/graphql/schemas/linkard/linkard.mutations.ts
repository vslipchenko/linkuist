import {ApolloError, gql} from 'apollo-server-express';
import {authenticationGuard} from '../../../utilities/guards';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {Linkard} from '../../../models/linkard';
import {fetchUrlMetadata} from '../../../utilities/url-metadata';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {getUtcMillisecondTimestamp} from '../../../utilities/date';

const createLinkard = async (
  _: unknown,
  {input}: {input: Omit<ILinkard, 'userId' | 'createdAt'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<ILinkard> | ApolloError> => {
  const {tokenData, error} = await authenticationGuard(accessToken);
  if (error) return error;
  // TODO Bookmark input validation
  // try {
  //   new URL(input.link);
  // } catch (error) {
  //   return new ApolloError(''); // Pre-validates on the client
  // }
  console.log('create linkard input ', tokenData.userId, input);

  // const isValidBookmark = checkDataValidity({input, pattern: /wa/});
  //
  // if (!isValidBookmark) { // assume UI validation was passed
  //   return new ApolloError('');
  // }

  // const nullishProperties = getNullishProperties<IgnoreMetadataProperties>(input, ['title', 'description', 'image', 'icon']);

  const metadata = await fetchUrlMetadata(input.link);

  // return new Promise((resolve) => resolve);
  return Linkard.create({
    ...input,
    metadata,
    userId: tokenData.userId,
    createdAt: getUtcMillisecondTimestamp(),
  });
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
