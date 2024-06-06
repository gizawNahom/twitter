const typeDefs = `#graphql
  type Query {
    hello: String
    post(id: ID!): Post
    posts(userId: ID!, limit: Int!, offset: Int!): [Post]
    searchPosts(query: String!, limit: Int!, offset: Int!): [Post]
  }
  type Mutation {
    createPost(text: String!): Post
  }
  type Post {
    id: ID!
    text: String!
    userId: ID!
    createdAt: String!
  }
`;

export default typeDefs;
