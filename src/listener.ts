import { getConfig } from './config'
import WebSocket from 'ws'
import got from 'got'
import { deconzConfigSchema, deconzEventSchema } from './types'
import { sensorEventHandler } from './sensor-event-handler'

export const listener = async () => {
  const { gatewayUrl, gatewayApiKey } = getConfig()

  if (!gatewayUrl) {
    throw new Error(
      'Gateway URL has not been set. First run the gateway command to set your gateway details.'
    )
  }

  if (!gatewayApiKey) {
    throw new Error(
      'Gateway apiKey has not been set. First run the gateway command to set your gateway details.'
    )
  }

  console.log('starting...')

  const configResponse = await got.get(
    `${gatewayUrl}/api/${gatewayApiKey}/config`
  )
  const gatewayConfig = deconzConfigSchema.parse(
    JSON.parse(configResponse.body)
  )

  const ws = new WebSocket(
    `ws://${new URL(gatewayUrl).hostname}:${gatewayConfig.websocketport}`
  )

  ws.on('open', () => {
    console.log('Connected to gateway')
  })

  ws.on('message', async (message: Buffer) => {
    const messageJson = message.toString('utf8')
    const event = deconzEventSchema.parse(JSON.parse(messageJson))
    if (event.r === 'sensors') {
      await sensorEventHandler(event)
    }
    // TODO: Invalidate sensors on config change (not state change)
  })

  ws.on('close', () => {
    console.log('Disconnected from gateway')
    // TODO: Attempt reconnect
  })
}
