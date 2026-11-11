import { getConfig } from './config'
import WebSocket from 'ws'
import got from 'got'
import { deconzConfigSchema, deconzEventSchema } from './types'
import { sensorEventHandler } from './sensor-event-handler'
import { invalidateSensors } from './virtual-sensors'

const RECONNECT_DELAY_MS = 5000

export const startListener = async () => {
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

  const reconnect = () => {
    // Sensors may have been added or removed while disconnected.
    invalidateSensors()
    setTimeout(connect, RECONNECT_DELAY_MS)
  }

  const connect = async () => {
    let websocketPort: number
    try {
      const configResponse = await got.get(
        `${gatewayUrl}/api/${gatewayApiKey}/config`
      )
      websocketPort = deconzConfigSchema.parse(
        JSON.parse(configResponse.body)
      ).websocketport
    } catch (err) {
      console.error(`Could not read gateway config: ${err}`)
      reconnect()
      return
    }

    const ws = new WebSocket(
      `ws://${new URL(gatewayUrl).hostname}:${websocketPort}`
    )

    ws.on('open', () => {
      console.log('Connected to gateway')
    })

    ws.on('message', async (message: Buffer) => {
      try {
        const parsed = deconzEventSchema.safeParse(
          JSON.parse(message.toString('utf8'))
        )
        if (parsed.success && parsed.data.r === 'sensors') {
          await sensorEventHandler(parsed.data)
        }
      } catch (err) {
        console.error(`Failed to handle gateway event: ${err}`)
      }
    })

    ws.on('error', err => {
      console.error(`Gateway connection error: ${err.message}`)
    })

    ws.on('close', () => {
      console.log('Disconnected from gateway, reconnecting')
      reconnect()
    })
  }

  await connect()
}
