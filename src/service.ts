import { readConfig } from './config'

export const service = async () => {
  const config = readConfig()

  if (!config.gatewayHost) {
    throw new Error(
      'Gateway host has not been set. First run the gateway command to set your gateway details.'
    )
  }

  if (!config.gatewayApiKey) {
    throw new Error(
      'Gateway apiKey has not been set. First run the gateway command to set your gateway details.'
    )
  }

  const gatewayApiKey = config.gatewayApiKey

  console.log('starting...')
}
