import {
  AuthGateway,
  DummyAuthGateway,
  GetLoggedInUserUseCase,
} from './getLoggedInUserUseCase';

export class DI {
  static authGateway: AuthGateway = new DummyAuthGateway();
  static getLoggedInUserUseCase: GetLoggedInUserUseCase =
    new GetLoggedInUserUseCase(DI.authGateway);
}
