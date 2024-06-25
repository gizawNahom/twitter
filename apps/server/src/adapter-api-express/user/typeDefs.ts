const typeDefs = `#graphql
  type Query {
    users(username: String!, limit: Int!, offset: Int!): [User!]!
  }
`;

export default typeDefs;
