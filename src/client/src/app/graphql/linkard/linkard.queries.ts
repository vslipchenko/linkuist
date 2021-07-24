import gql from 'graphql-tag';
import {METADATA_PREVIEW_FRAGMENT} from '~app/graphql/linkard/linkard.fragments';

export const GET_LINKARDS_BY_USER_ID = gql`
  ${METADATA_PREVIEW_FRAGMENT}
  query ($userId: String!) {
    linkardsByUserId(userId: $userId) {
      createdAt
      note
      metadata {
        ...MetadataPreviewFragment
      }
    }
  }
`;

export const GET_LINKARDS_BY_USERNAME = gql`
  ${METADATA_PREVIEW_FRAGMENT}
  query ($username: String!) {
    linkardsByUsername(username: $username) {
      createdAt
      note
      metadata {
        ...MetadataPreviewFragment
      }
    }
  }
`;
