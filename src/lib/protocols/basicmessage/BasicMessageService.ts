import { InboundMessage } from '../../types';
import { createOutboundMessage } from '../helpers';
import { Connection } from '../connections/domain/Connection';
import { BasicMessageRepository, CustomBasicMessage } from './BasicMessageRepository';
import { createBasicMessage } from './messages';

class BasicMessageService {
  basicMessageRepository: BasicMessageRepository;

  constructor(basicMessageRepository: BasicMessageRepository) {
    this.basicMessageRepository = basicMessageRepository;
  }

  send(message: string, connection: Connection) {
    const basicMessage = createBasicMessage(message);
    this.basicMessageRepository.save({ role: 'sender', message: basicMessage });
    return createOutboundMessage(connection, basicMessage);
  }

  save(inboundMessage: InboundMessage, connection: Connection) {
    const { message } = inboundMessage;
    this.basicMessageRepository.save({ role: 'receiver', message });
    connection.emit('basicMessageReceived', message);
    return null;
  }

  getMessages(): CustomBasicMessage[] {
    return this.basicMessageRepository.getAll();
  }
}

export { BasicMessageService };
