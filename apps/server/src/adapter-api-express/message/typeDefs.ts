const typeDefs = `#graphql
  type Mutation {
    sendMessage(text: String!, chatId: String!): Message
  }

  type Query {
    chats(limit: Int!, offset: Int!): [Chat!]!
    messages(limit: Int!, offset: Int!, chatId: String!): [Message!]!
  }

  type Message {
    id: ID!
    senderId: ID!
    chatId: ID!
    text: String!
    createdAt: String!
  }

  type Chat {
    id:  ID!
    createdAtISO: String!
    participant: User!
  }

  type User {
    username: String!
    displayName: String!
    profilePic: String!
  }
`;

export default typeDefs;
