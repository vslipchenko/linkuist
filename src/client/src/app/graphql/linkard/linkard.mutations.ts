import gql from 'graphql-tag';

export const CREATE_LINKARD = gql`
  mutation ($input: CreateLinkardMutationInput!) {
    createLinkard(input: $input) {
      _id
      createdAt
      link
      isPrivate
      isPaid
      note
      metadata
      tags
    }
  }
`;
