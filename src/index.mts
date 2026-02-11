/* eslint-disable react-hooks/rules-of-hooks */
import { message } from '@C/message.js'
import { _wait } from '@H/_wait.js'
import { Boom } from '@hapi/boom'
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys'
import P from 'pino'
import qrCode from 'qrcode'

const { state, saveCreds } = await useMultiFileAuthState('./baileys_auth')

const sock = makeWASocket({
  auth:   state,
  logger: P(), // you can configure this as much as you want, even including streaming the logs to a ReadableStream for upload or saving to a file
})

sock.ev.on('creds.update', () => {
  return saveCreds()
})

sock.ev.on('creds.update', (v) => console.log(v))
sock.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr } = update

  console.log(connection)
  console.log(lastDisconnect)

  if (connection === 'close') {
    if ((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.restartRequired) {
      console.log(lastDisconnect)
    } else {
      console.log(lastDisconnect)
    }
  }
  if (qr) {
    await qrCode.toString(qr, { type: 'terminal' })
  }
})

sock.ev?.on('messages.upsert', message.upsertHandler)

while (1) {
  await _wait(2)
  console.log('.')
}
