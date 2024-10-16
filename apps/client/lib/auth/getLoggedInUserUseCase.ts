import { SignedInUser } from './authContext';

export class GetLoggedInUserUseCase {
  execute(): SignedInUser {
    return {
      id: 'senderId',
    };
  }
}
