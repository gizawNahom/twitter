import {
  AuthGateway,
  DummyAuthGateway,
  GetLoggedInUserUseCase,
} from './getLoggedInUserUseCase';

export class Context {
  static authGateway: AuthGateway = new DummyAuthGateway();
  static getLoggedInUserUseCase: GetLoggedInUserUseCase =
    new GetLoggedInUserUseCase(Context.authGateway);
}
