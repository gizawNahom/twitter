import { mutation as postMutation } from './post/mutation';
import { query as postQuery } from './post/query';
import { mutation as messageMutation } from './message/mutation';
import { query as messageQuery } from './message/query';
import { query as userQuery } from './user/query';

const resolvers = {
  Mutation: { ...postMutation, ...messageMutation },
  Query: { ...postQuery, ...messageQuery, ...userQuery },
};

export default resolvers;
