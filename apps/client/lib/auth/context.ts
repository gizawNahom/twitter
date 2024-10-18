import {
  AuthGateway,
  DummyAuthGateway,
  GetLoggedInUserUseCase,
} from './getLoggedInUserUseCase';

export class Context {
  static authGateway: AuthGateway = new DummyAuthGateway();
  static get getLoggedInUserUseCase(): GetLoggedInUserUseCase {
    return new GetLoggedInUserUseCase(Context.authGateway);
  }
}
