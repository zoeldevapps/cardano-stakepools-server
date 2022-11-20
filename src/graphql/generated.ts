import type { GraphQLResolveInfo } from 'graphql';
import type { MercuriusContext } from 'mercurius';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) =>
  | Promise<import('mercurius-codegen').DeepPartial<TResult>>
  | import('mercurius-codegen').DeepPartial<TResult>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type Query = {
  __typename?: 'Query';
  stakepool?: Maybe<Stakepool>;
  stakepools?: Maybe<PagedStakepools>;
};

export type QuerystakepoolArgs = {
  id: Scalars['ID'];
};

export type QuerystakepoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['ID']>;
};

export type StakepoolEdge = {
  __typename?: 'StakepoolEdge';
  node: Stakepool;
  cursor: Scalars['String'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
};

export type PagedStakepools = {
  __typename?: 'PagedStakepools';
  edges: Array<StakepoolEdge>;
  pageInfo: PageInfo;
};

export type Stakepool = {
  __typename?: 'Stakepool';
  id: Scalars['ID'];
  parameters?: Maybe<StakepoolParameters>;
  rewardInfo?: Maybe<StakepoolRewardInfo>;
  metadata?: Maybe<StakepoolMetadata>;
  extendedMetadata?: Maybe<StakepoolExtendedMetadata>;
};

export type RelayByAddress = {
  __typename?: 'RelayByAddress';
  ipv4?: Maybe<Scalars['String']>;
  ipv6?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
};

export type RelayByName = {
  __typename?: 'RelayByName';
  hostname: Scalars['String'];
  port?: Maybe<Scalars['Int']>;
};

export type Relay = RelayByAddress | RelayByName;

export type StakepoolParameters = {
  __typename?: 'StakepoolParameters';
  cost: Scalars['String'];
  margin: Scalars['String'];
  metadataHash?: Maybe<Scalars['String']>;
  metdataUrl?: Maybe<Scalars['String']>;
  owners: Array<Scalars['String']>;
  pledge: Scalars['String'];
  relays: Array<Relay>;
  rewardAccount: Scalars['String'];
  vrf: Scalars['String'];
};

export type StakepoolMetadata = {
  __typename?: 'StakepoolMetadata';
  name?: Maybe<Scalars['String']>;
  ticker?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  extendedUrl?: Maybe<Scalars['String']>;
};

export type StakepoolExtendedMetadata = {
  __typename?: 'StakepoolExtendedMetadata';
  urlPngLogo?: Maybe<Scalars['String']>;
  urlPngIcon64?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  about?: Maybe<StakepoolAbout>;
  social?: Maybe<StakepoolSocial>;
  saturatedRecommend?: Maybe<Array<Scalars['String']>>;
};

export type StakepoolAbout = {
  __typename?: 'StakepoolAbout';
  server?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  me?: Maybe<Scalars['String']>;
};

export type StakepoolSocial = {
  __typename?: 'StakepoolSocial';
  twitter?: Maybe<Scalars['String']>;
  telegram?: Maybe<Scalars['String']>;
};

export type StakepoolRewardInfo = {
  __typename?: 'StakepoolRewardInfo';
  stake: Scalars['String'];
  ownerStake: Scalars['String'];
  performance: Scalars['Float'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  StakepoolEdge: ResolverTypeWrapper<StakepoolEdge>;
  String: ResolverTypeWrapper<Scalars['String']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PagedStakepools: ResolverTypeWrapper<PagedStakepools>;
  Stakepool: ResolverTypeWrapper<Stakepool>;
  RelayByAddress: ResolverTypeWrapper<RelayByAddress>;
  RelayByName: ResolverTypeWrapper<RelayByName>;
  Relay: ResolversTypes['RelayByAddress'] | ResolversTypes['RelayByName'];
  StakepoolParameters: ResolverTypeWrapper<
    Omit<StakepoolParameters, 'relays'> & { relays: Array<ResolversTypes['Relay']> }
  >;
  StakepoolMetadata: ResolverTypeWrapper<StakepoolMetadata>;
  StakepoolExtendedMetadata: ResolverTypeWrapper<StakepoolExtendedMetadata>;
  StakepoolAbout: ResolverTypeWrapper<StakepoolAbout>;
  StakepoolSocial: ResolverTypeWrapper<StakepoolSocial>;
  StakepoolRewardInfo: ResolverTypeWrapper<StakepoolRewardInfo>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  StakepoolEdge: StakepoolEdge;
  String: Scalars['String'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  PagedStakepools: PagedStakepools;
  Stakepool: Stakepool;
  RelayByAddress: RelayByAddress;
  RelayByName: RelayByName;
  Relay: ResolversParentTypes['RelayByAddress'] | ResolversParentTypes['RelayByName'];
  StakepoolParameters: Omit<StakepoolParameters, 'relays'> & { relays: Array<ResolversParentTypes['Relay']> };
  StakepoolMetadata: StakepoolMetadata;
  StakepoolExtendedMetadata: StakepoolExtendedMetadata;
  StakepoolAbout: StakepoolAbout;
  StakepoolSocial: StakepoolSocial;
  StakepoolRewardInfo: StakepoolRewardInfo;
  Float: Scalars['Float'];
};

export type QueryResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  stakepool?: Resolver<
    Maybe<ResolversTypes['Stakepool']>,
    ParentType,
    ContextType,
    RequireFields<QuerystakepoolArgs, 'id'>
  >;
  stakepools?: Resolver<
    Maybe<ResolversTypes['PagedStakepools']>,
    ParentType,
    ContextType,
    Partial<QuerystakepoolsArgs>
  >;
};

export type StakepoolEdgeResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolEdge'] = ResolversParentTypes['StakepoolEdge']
> = {
  node?: Resolver<ResolversTypes['Stakepool'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']
> = {
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PagedStakepoolsResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['PagedStakepools'] = ResolversParentTypes['PagedStakepools']
> = {
  edges?: Resolver<Array<ResolversTypes['StakepoolEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StakepoolResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Stakepool'] = ResolversParentTypes['Stakepool']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parameters?: Resolver<Maybe<ResolversTypes['StakepoolParameters']>, ParentType, ContextType>;
  rewardInfo?: Resolver<Maybe<ResolversTypes['StakepoolRewardInfo']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['StakepoolMetadata']>, ParentType, ContextType>;
  extendedMetadata?: Resolver<Maybe<ResolversTypes['StakepoolExtendedMetadata']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayByAddressResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['RelayByAddress'] = ResolversParentTypes['RelayByAddress']
> = {
  ipv4?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ipv6?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  port?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayByNameResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['RelayByName'] = ResolversParentTypes['RelayByName']
> = {
  hostname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  port?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Relay'] = ResolversParentTypes['Relay']
> = {
  resolveType: TypeResolveFn<'RelayByAddress' | 'RelayByName', ParentType, ContextType>;
};

export type StakepoolParametersResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolParameters'] = ResolversParentTypes['StakepoolParameters']
> = {
  cost?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  margin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadataHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metdataUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owners?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  pledge?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  relays?: Resolver<Array<ResolversTypes['Relay']>, ParentType, ContextType>;
  rewardAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vrf?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StakepoolMetadataResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolMetadata'] = ResolversParentTypes['StakepoolMetadata']
> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ticker?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  extendedUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StakepoolExtendedMetadataResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolExtendedMetadata'] = ResolversParentTypes['StakepoolExtendedMetadata']
> = {
  urlPngLogo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  urlPngIcon64?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  about?: Resolver<Maybe<ResolversTypes['StakepoolAbout']>, ParentType, ContextType>;
  social?: Resolver<Maybe<ResolversTypes['StakepoolSocial']>, ParentType, ContextType>;
  saturatedRecommend?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StakepoolAboutResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolAbout'] = ResolversParentTypes['StakepoolAbout']
> = {
  server?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StakepoolSocialResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolSocial'] = ResolversParentTypes['StakepoolSocial']
> = {
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  telegram?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StakepoolRewardInfoResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['StakepoolRewardInfo'] = ResolversParentTypes['StakepoolRewardInfo']
> = {
  stake?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerStake?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  performance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MercuriusContext> = {
  Query?: QueryResolvers<ContextType>;
  StakepoolEdge?: StakepoolEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PagedStakepools?: PagedStakepoolsResolvers<ContextType>;
  Stakepool?: StakepoolResolvers<ContextType>;
  RelayByAddress?: RelayByAddressResolvers<ContextType>;
  RelayByName?: RelayByNameResolvers<ContextType>;
  Relay?: RelayResolvers<ContextType>;
  StakepoolParameters?: StakepoolParametersResolvers<ContextType>;
  StakepoolMetadata?: StakepoolMetadataResolvers<ContextType>;
  StakepoolExtendedMetadata?: StakepoolExtendedMetadataResolvers<ContextType>;
  StakepoolAbout?: StakepoolAboutResolvers<ContextType>;
  StakepoolSocial?: StakepoolSocialResolvers<ContextType>;
  StakepoolRewardInfo?: StakepoolRewardInfoResolvers<ContextType>;
};

export type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import('fastify').FastifyReply;
  }
) => Promise<Array<import('mercurius-codegen').DeepPartial<TReturn>>>;
export type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<
  TContext = import('mercurius').MercuriusContext & { reply: import('fastify').FastifyReply }
> {
  StakepoolEdge?: {
    node?: LoaderResolver<Stakepool, StakepoolEdge, {}, TContext>;
    cursor?: LoaderResolver<Scalars['String'], StakepoolEdge, {}, TContext>;
  };

  PageInfo?: {
    endCursor?: LoaderResolver<Scalars['String'], PageInfo, {}, TContext>;
    hasNextPage?: LoaderResolver<Scalars['Boolean'], PageInfo, {}, TContext>;
  };

  PagedStakepools?: {
    edges?: LoaderResolver<Array<StakepoolEdge>, PagedStakepools, {}, TContext>;
    pageInfo?: LoaderResolver<PageInfo, PagedStakepools, {}, TContext>;
  };

  Stakepool?: {
    id?: LoaderResolver<Scalars['ID'], Stakepool, {}, TContext>;
    parameters?: LoaderResolver<Maybe<StakepoolParameters>, Stakepool, {}, TContext>;
    rewardInfo?: LoaderResolver<Maybe<StakepoolRewardInfo>, Stakepool, {}, TContext>;
    metadata?: LoaderResolver<Maybe<StakepoolMetadata>, Stakepool, {}, TContext>;
    extendedMetadata?: LoaderResolver<Maybe<StakepoolExtendedMetadata>, Stakepool, {}, TContext>;
  };

  RelayByAddress?: {
    ipv4?: LoaderResolver<Maybe<Scalars['String']>, RelayByAddress, {}, TContext>;
    ipv6?: LoaderResolver<Maybe<Scalars['String']>, RelayByAddress, {}, TContext>;
    port?: LoaderResolver<Maybe<Scalars['Int']>, RelayByAddress, {}, TContext>;
  };

  RelayByName?: {
    hostname?: LoaderResolver<Scalars['String'], RelayByName, {}, TContext>;
    port?: LoaderResolver<Maybe<Scalars['Int']>, RelayByName, {}, TContext>;
  };

  StakepoolParameters?: {
    cost?: LoaderResolver<Scalars['String'], StakepoolParameters, {}, TContext>;
    margin?: LoaderResolver<Scalars['String'], StakepoolParameters, {}, TContext>;
    metadataHash?: LoaderResolver<Maybe<Scalars['String']>, StakepoolParameters, {}, TContext>;
    metdataUrl?: LoaderResolver<Maybe<Scalars['String']>, StakepoolParameters, {}, TContext>;
    owners?: LoaderResolver<Array<Scalars['String']>, StakepoolParameters, {}, TContext>;
    pledge?: LoaderResolver<Scalars['String'], StakepoolParameters, {}, TContext>;
    relays?: LoaderResolver<Array<Relay>, StakepoolParameters, {}, TContext>;
    rewardAccount?: LoaderResolver<Scalars['String'], StakepoolParameters, {}, TContext>;
    vrf?: LoaderResolver<Scalars['String'], StakepoolParameters, {}, TContext>;
  };

  StakepoolMetadata?: {
    name?: LoaderResolver<Maybe<Scalars['String']>, StakepoolMetadata, {}, TContext>;
    ticker?: LoaderResolver<Maybe<Scalars['String']>, StakepoolMetadata, {}, TContext>;
    description?: LoaderResolver<Maybe<Scalars['String']>, StakepoolMetadata, {}, TContext>;
    homepage?: LoaderResolver<Maybe<Scalars['String']>, StakepoolMetadata, {}, TContext>;
    extendedUrl?: LoaderResolver<Maybe<Scalars['String']>, StakepoolMetadata, {}, TContext>;
  };

  StakepoolExtendedMetadata?: {
    urlPngLogo?: LoaderResolver<Maybe<Scalars['String']>, StakepoolExtendedMetadata, {}, TContext>;
    urlPngIcon64?: LoaderResolver<Maybe<Scalars['String']>, StakepoolExtendedMetadata, {}, TContext>;
    location?: LoaderResolver<Maybe<Scalars['String']>, StakepoolExtendedMetadata, {}, TContext>;
    about?: LoaderResolver<Maybe<StakepoolAbout>, StakepoolExtendedMetadata, {}, TContext>;
    social?: LoaderResolver<Maybe<StakepoolSocial>, StakepoolExtendedMetadata, {}, TContext>;
    saturatedRecommend?: LoaderResolver<
      Maybe<Array<Scalars['String']>>,
      StakepoolExtendedMetadata,
      {},
      TContext
    >;
  };

  StakepoolAbout?: {
    server?: LoaderResolver<Maybe<Scalars['String']>, StakepoolAbout, {}, TContext>;
    company?: LoaderResolver<Maybe<Scalars['String']>, StakepoolAbout, {}, TContext>;
    me?: LoaderResolver<Maybe<Scalars['String']>, StakepoolAbout, {}, TContext>;
  };

  StakepoolSocial?: {
    twitter?: LoaderResolver<Maybe<Scalars['String']>, StakepoolSocial, {}, TContext>;
    telegram?: LoaderResolver<Maybe<Scalars['String']>, StakepoolSocial, {}, TContext>;
  };

  StakepoolRewardInfo?: {
    stake?: LoaderResolver<Scalars['String'], StakepoolRewardInfo, {}, TContext>;
    ownerStake?: LoaderResolver<Scalars['String'], StakepoolRewardInfo, {}, TContext>;
    performance?: LoaderResolver<Scalars['Float'], StakepoolRewardInfo, {}, TContext>;
  };
}
declare module 'mercurius' {
  interface IResolvers extends Resolvers<import('mercurius').MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
