import got from 'got'
import { Resource } from './types'
import { getSensors as fetchSensors } from './gateway-client'

// TODO: Sensor resource only
let sensorsInstance: Record<string, Resource> | null = null

export const getSensors = async () => {
  const sensors = sensorsInstance ?? (await fetchSensors())
  sensorsInstance = sensors
  return sensors
}

// TODO: Incrementally patch sensors on updates instead
export const invalidateSensors = () => {
  sensorsInstance = null
}
