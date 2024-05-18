import { gql } from 'apollo-server-express';

export default gql`

type User {
  id: ID!
  fullName: String!
  username: String!
  profilePhoto: String
  followers: [Follower!]!
  following: [Follower!]!
  posts: [Post!]!
  likes: [Like!]!
}

type UsersResponse {
  message: String!
  data: [User!]!
}

type UserResponse {
  message: String!
  data: User
}

type Tokens {
  accessToken: String!
  refreshToken: String!
}

type TokenResponse {
  message: String!
  data: Tokens
}

type Query {
  users: UsersResponse
  user(id: ID!): UserResponse
}

type Mutation {
  refreshToken(refreshToken: String!): TokenResponse
}
`;
