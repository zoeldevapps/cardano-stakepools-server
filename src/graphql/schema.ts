import { gql } from 'mercurius-codegen';

export const schema = gql`
  type Query {
    stakepool(id: ID!): Stakepool
    stakepools(first: Int, after: ID): PagedStakepools
  }

  type StakepoolEdge {
    node: Stakepool!
    cursor: String!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }

  type PagedStakepools {
    edges: [StakepoolEdge!]!
    pageInfo: PageInfo!
  }

  type Stakepool {
    id: ID!
    parameters: StakepoolParameters
    rewardInfo: StakepoolRewardInfo
    metadata: StakepoolMetadata
    extendedMetadata: StakepoolExtendedMetadata
  }

  type RelayByAddress {
    ipv4: String
    ipv6: String
    port: Int
  }

  type RelayByName {
    hostname: String!
    port: Int
  }

  union Relay = RelayByAddress | RelayByName

  type StakepoolParameters {
    cost: String! # bigint
    margin: String! # fraction
    metadataHash: String
    metdataUrl: String
    owners: [String!]!
    pledge: String! # bigint
    relays: [Relay!]!
    rewardAccount: String!
    vrf: String!
  }

  type StakepoolMetadata {
    name: String
    ticker: String
    description: String
    homepage: String
    extendedUrl: String
  }

  type StakepoolExtendedMetadata {
    urlPngLogo: String
    urlPngIcon64: String
    location: String
    about: StakepoolAbout
    social: StakepoolSocial
    saturatedRecommend: [String!]
  }

  type StakepoolAbout {
    server: String
    company: String
    me: String
  }

  type StakepoolSocial {
    twitter: String
    telegram: String
  }

  type StakepoolRewardInfo {
    stake: String! # bigint
    ownerStake: String! #bigint
    performance: Float!
  }
`;
