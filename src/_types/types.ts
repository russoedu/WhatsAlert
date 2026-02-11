import { MessageUpsertType, WAMessage } from 'baileys'

export interface MessageUpsertI {
    messages: WAMessage[],
    type: MessageUpsertType,
    requestId?: string,
}
