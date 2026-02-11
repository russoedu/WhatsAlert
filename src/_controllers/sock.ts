/* eslint-disable react-hooks/rules-of-hooks */
import { Boom } from '@hapi/boom'
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys'
import P from 'pino'
import qrCode from 'qrcode'
import { message } from './message'

class Sock {
  #initialised: boolean
  #waSock: ReturnType<typeof makeWASocket>

  constructor () {
    this.#initialised = false
  }

  async connect () {
    if (this.#initialised) return

    const { state, saveCreds } = await useMultiFileAuthState('./baileys_auth')

    this.#waSock = makeWASocket({
      auth:   state,
      logger: P(), // you can configure this as much as you want, even including streaming the logs to a ReadableStream for upload or saving to a file
    })

    this.#waSock.ev.on('creds.update', () => {
      this.#initialised = true

      return saveCreds()
    })

    this.#waSock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      console.log(connection)
      console.log(lastDisconnect)

      if (
        connection === 'close' &&
          (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.restartRequired
      ) {
        this.#initialised = false
      }
      if (qr) {
        await qrCode.toString(qr, { type: 'terminal' })
      }
    })

    this.#waSock.ev?.on('messages.upsert', message.upsertHandler)
  }

  get waSock () {
    return this.#waSock
  }
}

const sock = new Sock()
export { sock }
