/* eslint-disable react-hooks/rules-of-hooks */
import { Boom } from '@hapi/boom'
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys'
import P from 'pino'
import qrCode from 'qrcode'

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

    this.#waSock.ev.on('creds.update', () => this.#saveCreds(saveCreds))
    this.#waSock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (
        connection === 'close' &&
          (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.restartRequired
      ) {
        this.#initialised = false
        await this.connect()
      }
      if (qr) {
        await qrCode.toString(qr, { type: 'terminal' })
      }
    })

    return this.ev
  }

  #saveCreds (saveCreds: () => Promise<void>) {
    this.#initialised = true

    return saveCreds()
  }

  get ev () {
    return this.#waSock.ev
  }

  get waSock () {
    return this.#waSock
  }
}

const sock = new Sock()
export { sock }
