import { GetLoggedInUserUseCase } from './getLoggedInUserUseCase';

export class DI {
  static getLoggedInUserUseCase: GetLoggedInUserUseCase =
    new GetLoggedInUserUseCase();
}
