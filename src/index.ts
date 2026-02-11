import { message } from '@C/message'
import { sock } from '@C/sock'

async function main () {
  const ev = await sock.connect()

  ev?.on('messages.upsert', message.upsertHandler)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
