const typeDefs = `#graphql
  type Mutation {
    sendMessage(text: String!, chatId: String!): Message
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
