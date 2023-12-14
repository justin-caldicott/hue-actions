import { DeconzEvent } from './types'
import { getConfig } from './config'
import { getSensors } from './gateway-client'

export const sensorEventHandler = async (event: DeconzEvent) => {
  const config = getConfig()
  console.log(`Sensor event: ${JSON.stringify(event)}`)

  if (event.id === undefined) {
    console.warn('Ignoring sensor event without id')
    return
  }

  const sensors = await getSensors()
  const sensor = sensors[event.id]
  const sensorConfig = config.sensors.find(s => s.name === sensor.name)

  console.log(`Sensor matched ${sensor.name} ${sensorConfig !== undefined}`)
}
