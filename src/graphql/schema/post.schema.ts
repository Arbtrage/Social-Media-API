import { gql } from 'apollo-server-express';

export default gql`

  type Post {
    id: ID!
    content: String!
    media: String
    createdAt: String!
    scheduledAt:String
    author: User
    likes: [Like!]
    comments: [Comment!]
    commentsCount: Int!
    likesCount: Int!
    commentsEnabled: Boolean!
  }

  type FeedResponse{
    message:String!
    data:[Post!]!
  }

  type PostsResponse{
    message:String!
    data:[Post!]!
  }

  type PostResponse{
    message:String!
    data:Post
  }

  extend type Query {
    posts: PostsResponse
    post(id: ID!): PostResponse
    feed: FeedResponse
  }

  type CreatePostResponse {
    data: Post
    message:String!
  }

  type DeletePostResponse {
    data: Boolean!
    message:String!
  }

  type ToggleCommentsResponse {
    data: Post
    message:String!
  }

  extend type Mutation {
    createPost(content: String!, media: String, commentsEnabled: Boolean!, scheduledAt: String,byTime:Boolean): CreatePostResponse
    deletePost(id: ID!): DeletePostResponse
    toggleComments(postId: ID!, enabled: Boolean!): ToggleCommentsResponse
  }
`;
