import got from 'got'
import { getConfig as c } from './config'
import { deconzConfigSchema, resourcesResponseSchema } from './types'

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
  return resourcesResponseSchema.parse(JSON.parse(response.body))
}
