import { MessageUpsertI } from '../_types/types'
import notifier from 'node-notifier'

class Message {
  upsertHandler ({ type, messages }: MessageUpsertI) {
    if (type === 'notify') { // new messages
      for (const message of messages) {
        console.log(message)
        notifier.notify({
          title:   message.pushName!,
          message: message.message?.conversation ?? 'No message content',
        })
      }
    } else { // old already seen / handled messages
    // handle them however you want to
    }
  }
}

const message = new Message()
export { message }
