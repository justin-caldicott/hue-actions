import got from 'got'
import { getConfig as c } from './config'
import { deconzConfigSchema, sensorsResponseSchema } from './types'

export const getConfig = async () => {
  const response = await got.get(
    `${c().gatewayUrl}/api/${c().gatewayApiKey}/config`
  )
  return deconzConfigSchema.parse(JSON.parse(response.body))
}

export const getSensors = async () => {
  const response = await got.get(
    `${c().gatewayUrl}/api/${c().gatewayApiKey}/sensors`
  )
  return sensorsResponseSchema.parse(JSON.parse(response.body))
}

export const createSensor = async ({
  name,
  type,
}: {
  name: string
  type: string
}) => {
  await got.post(`${c().gatewayUrl}/api/${c().gatewayApiKey}/sensors`, {
    body: JSON.stringify({
      name,
      type,
      swversion: '1.0',
      manufacturername: 'hue-actions',
      modelid: name,
      uniqueid: `hue-actions::sensor::${name}`,
    }),
  })
}
