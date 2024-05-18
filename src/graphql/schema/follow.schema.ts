import { gql } from 'apollo-server-express';

export default gql`
  type Follower {
    id: ID!
    user: User!
    follower: User!
  }

  type FollowResponse{
    message: String!
    data: Follower
  }

  type UnfollowResponse{
    message: String!
    data: Boolean
  }

  extend type Mutation {
    followUser(userId: ID!): FollowResponse
    unfollowUser(userId: ID!): UnfollowResponse
  }
`;
