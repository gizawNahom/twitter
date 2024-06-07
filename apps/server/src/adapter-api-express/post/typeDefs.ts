const typeDefs = `#graphql
  type Query {
    hello: String
    post(id: ID!): Post
    posts(userId: ID!, limit: Int!, offset: Int!): [Post]
    searchPosts(query: String!, limit: Int!, offset: Int!): [Post]
  }
  type Mutation {
    createPost(text: String!): Post
    sendMessage(text: String!, chatId: String!): Message
  }
  type Post {
    id: ID!
    text: String!
    userId: ID!
    createdAt: String!
  }
  type Message {
    id: ID!
    senderId: ID!
    chatId: ID!
    text: String!
    createdAt: String!
  }
`;

export default typeDefs;
