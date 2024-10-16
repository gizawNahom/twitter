import { SignedInUser } from './authContext';

export class GetLoggedInUserUseCase {
  constructor(private authGateway: AuthGateway) {}

  execute(): SignedInUser {
    return this.authGateway.getLoggedInUser();
  }
}

export interface AuthGateway {
  getLoggedInUser(): SignedInUser;
}

export class DummyAuthGateway {
  getLoggedInUser() {
    return {
      id: 'senderId',
    };
  }
}
