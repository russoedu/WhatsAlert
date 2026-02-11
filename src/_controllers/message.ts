import { MessageUpsertI } from '../_types/types'
class Message {
  upsertHandler ({ type, messages }: MessageUpsertI) {
    if (type === 'notify') { // new messages
      for (const message of messages) {
        console.log(message)
      // messages is an array, do not just handle the first message, you will miss messages
      }
    } else { // old already seen / handled messages
    // handle them however you want to
    }
  }
}

const message = new Message()
export { message }
