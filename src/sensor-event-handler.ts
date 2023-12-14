import { DeconzEvent, GenericFlagState } from './types'
import { getConfig } from './config'
import { getVirtualSensors } from './virtual-sensors'
import { performAction } from './actions'

export const sensorEventHandler = async (event: DeconzEvent) => {
  const config = getConfig()
  // console.log(`Sensor event: ${JSON.stringify(event)}`)

  if (event.id === undefined) {
    console.warn('Ignoring sensor event without id')
    return
  }

  const sensors = await getVirtualSensors()
  const sensor = sensors[event.id]
  const sensorConfig =
    sensor !== undefined
      ? config.sensors.find(s => s.name === sensor.name)
      : undefined

  if (sensor !== undefined && sensorConfig !== undefined) {
    console.log(`Sensor ${sensor.name} state changed..`)
    switch (sensorConfig.type) {
      case 'CLIPGenericFlag': {
        await performAction(
          (event.state as GenericFlagState).flag
            ? sensorConfig.actions.flag.true
            : sensorConfig.actions.flag.false
        )
        break
      }
      case 'CLIPGenericStatus':
        break
    }
  }
}
