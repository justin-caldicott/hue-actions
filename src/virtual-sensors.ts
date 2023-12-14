import { getSensors as fetchSensors } from './gateway-client'
import { Sensor } from './types'

let virtualSensorsInstance: Record<string, Sensor> | null = null

// TODO: Explore stronger typing
const virtualSensorTypes = new Set(['CLIPGenericFlag', 'CLIPGenericStatus'])

export const getVirtualSensors = async (): Promise<Record<string, Sensor>> => {
  const sensors =
    virtualSensorsInstance ??
    Object.entries(await fetchSensors())
      .filter(([_, sensor]) => virtualSensorTypes.has(sensor.type))
      .reduce(
        (acc, [sensorId, sensor]) => ({ ...acc, ...{ [sensorId]: sensor } }),
        {}
      )
  virtualSensorsInstance = sensors
  return sensors
}

// TODO: Incrementally patch sensors on updates instead
export const invalidateSensors = () => {
  virtualSensorsInstance = null
}
