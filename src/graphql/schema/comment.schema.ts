import { gql } from 'apollo-server-express';

export default gql`
  type Comment {
    id: ID!
    content: String
    createdAt: String!
    post: Post!
    author: User
  }

  type CreateResponse{
    message:String!
    data:Comment
  }

  type EditResponse{
    message:String!
    data:Comment
  }

  type DeleteComment{
    message:String!
    data:Boolean
  }

  extend type Mutation {
    createComment(postId: ID!, content: String!): CreateResponse
    editComment(id: ID!, content: String!): EditResponse
    deleteComment(id: ID!): DeleteComment
  }
`;
