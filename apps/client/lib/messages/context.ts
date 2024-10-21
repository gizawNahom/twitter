import { Client } from '../../utilities/client';
import { SendMessageController } from './adapters/controllers/sendMessage/sendMessageController';
import {
  MessagesReader,
  ReadMessagesGatewayImpl,
} from './adapters/gateways/readMessagesGatewayImpl';
import {
  MessageSender,
  SendMessageGatewayImpl,
} from './adapters/gateways/sendMessageGatewayImpl';
import { ReadMessagesGateway } from './core/ports/readMessagesGateway';
import { SendMessageGateway } from './core/ports/sendMessageGateway';
import { ReadMessagesUseCase } from './core/useCases/readMessagesUseCase';
import { SendMessageUseCase } from './core/useCases/sendMessageUseCase';
import { ApolloMessageSender } from './data-source-apollo/apolloMessageSender';
import { ApolloMessagesReader } from './data-source-apollo/apolloMessagesReader';
import {
  IdGenerator,
  RandomIdGenerator,
} from './data-source-apollo/idGenerator';

export class Context {
  static idGenerator: IdGenerator = new RandomIdGenerator();
  static get messageSender(): MessageSender {
    return new ApolloMessageSender(Client.client, Context.idGenerator);
  }
  static get sendMessageGateway(): SendMessageGateway {
    return new SendMessageGatewayImpl(Context.messageSender);
  }
  static get sendMessageUseCase(): SendMessageUseCase {
    return new SendMessageUseCase(Context.sendMessageGateway);
  }
  static get messagesReader(): MessagesReader {
    return new ApolloMessagesReader();
  }
  static get readMessagesGateway(): ReadMessagesGateway {
    return new ReadMessagesGatewayImpl(Context.messagesReader);
  }
  static get readMessagesUseCase(): ReadMessagesUseCase {
    return new ReadMessagesUseCase(Context.readMessagesGateway);
  }
  static get sendMessageController(): SendMessageController {
    return new SendMessageController(Context.sendMessageUseCase);
  }
}
