import { gql } from 'apollo-server-express';

export default gql`
  type Like {
    id: ID!
    post: Post!
    user: User!
  }

  type LikeResponse{
    message:String!
  }
  
  type UnlikeResponse{
    message:String!
  }

  extend type Mutation {
    likePost(postId: ID!): LikeResponse
    unlikePost(postId: ID!): UnlikeResponse
  }
`;
