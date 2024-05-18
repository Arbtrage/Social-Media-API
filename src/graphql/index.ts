import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

import userSchema from './schema/user.schema';
import postSchema from './schema/post.schema';
import likeSchema from './schema/like.schema';
import commentSchema from './schema/comment.schema';
import followSchema from './schema/follow.schema';
import authSchema from './schema/auth.schema';

import userResolvers from './resolvers/user.resolver';
import postResolvers from './resolvers/post.resolver';
import likeResolvers from './resolvers/like.resolver';
import commentResolvers from './resolvers/comment.resolver';
import followResolvers from './resolvers/follow.resolver';
import authResolvers from './resolvers/auth.resolver';

export const typeDefs = mergeTypeDefs([authSchema,userSchema,likeSchema,followSchema,commentSchema,postSchema]);
export const resolvers = mergeResolvers([authResolvers,userResolvers,likeResolvers,followResolvers, postResolvers, commentResolvers]);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
