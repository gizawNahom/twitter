import { Client } from '../../utilities/client';
import {
  MessageSender,
  SendMessageGatewayImpl,
} from './adapters/gateways/sendMessageGatewayImpl';
import { SendMessageGateway } from './core/ports/sendMessageGateway';
import { SendMessageUseCase } from './core/useCases/sendMessageUseCase';
import { ApolloMessageSender } from './data-source-apollo/apolloMessageSender';
import {
  IdGenerator,
  RandomIdGenerator,
} from './data-source-apollo/idGenerator';

export class DI {
  static idGenerator: IdGenerator = new RandomIdGenerator();
  static get messageSender(): MessageSender {
    return new ApolloMessageSender(Client.client, DI.idGenerator);
  }
  static get sendMessageGateway(): SendMessageGateway {
    return new SendMessageGatewayImpl(DI.messageSender);
  }
  static get sendMessageUseCase(): SendMessageUseCase {
    return new SendMessageUseCase(DI.sendMessageGateway);
  }
}
