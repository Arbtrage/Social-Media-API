import { gql } from 'apollo-server-express';

export default gql`
type User {
  id: ID!
  fullName: String!
  username: String!
  profilePhoto: String
  email: String! 
  followers: [Follower!]!
  following: [Follower!]!
  posts: [Post!]!
  likes: [Like!]!
}

type RegisterResponse {
  message: String!
  data: User
}

type Tokens {
  accessToken: String!
  refreshToken: String!
}

type LoginResponse {
  message: String!
  data: Tokens
}

type Mutation {
  register(fullName: String!, username: String!, email: String!, password: String!): RegisterResponse
  login(email: String!, password: String!): LoginResponse
}
`;
