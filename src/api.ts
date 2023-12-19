import http from 'http'
import { parse } from 'yaml'
import { getConfig, updateConfig } from './config'
import { configSchema } from './types'
import { getVirtualSensors, invalidateSensors } from './virtual-sensors'
import { createSensor } from './gateway-client'

const host = '0.0.0.0'
const port = 14201

const getSensorName = ({ name, type }: { name: string; type: string }) =>
  `/${type}/${name}`

const putConfig = async (configYaml: string) => {
  const config = configSchema.pick({ sensors: true }).parse(parse(configYaml))

  const virtualSensors = await getVirtualSensors()
  const existingVirtualSensorFullNames = new Set(
    Object.values(virtualSensors).map(s => getSensorName(s))
  )
  const sensorsToCreate = config.sensors.filter(
    s => !existingVirtualSensorFullNames.has(getSensorName(s))
  )
  // TODO: Remove unused sensors that we've created
  for (const sensor of sensorsToCreate) {
    await createSensor(sensor)
    console.log(`created virtual sensor ${getSensorName(sensor)}`)
  }
  invalidateSensors()

  updateConfig({ ...getConfig(), ...config })
}

const server = http.createServer((req, res) => {
  if (req.url !== '/config') {
    res.writeHead(404)
    res.end('')
    console.warn(`Rejected request to unsupported url ${req.url}`)
    return
  }

  if (req.method !== 'PUT') {
    res.writeHead(404)
    res.end('')
    console.warn(`Rejected request to unsupported method ${req.method}`)
    return
  }

  const { gatewayApiKey } = getConfig()
  if (req.headers['apikey'] !== gatewayApiKey) {
    res.writeHead(401)
    res.end('')
    console.warn(
      // TODO: Not log passed in apikey
      `Rejected request to unrecognised apikey ${req.headers['apikey']}`
    )
    return
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  req.on('end', async () => {
    await putConfig(body)
    res.writeHead(200)
    res.end()
  })
})

export const startApi = () => {
  server.listen(port, host, () => {
    console.log(`API is running on http://${host}:${port}`)
  })
}
