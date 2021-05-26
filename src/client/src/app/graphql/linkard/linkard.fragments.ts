import gql from 'graphql-tag';

export const METADATA_PREVIEW_FRAGMENT = gql`
  fragment MetadataPreviewFragment on LinkardMetadata {
    hostname
    title
    description
    image
    icon
  }
`;
