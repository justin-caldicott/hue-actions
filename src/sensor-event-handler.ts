import { DeconzEvent, GenericFlagState, GenericStatusState } from './types'
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
        const action =
          (event.state as GenericStatusState).status >= 1 &&
          (event.state as GenericStatusState).status <= 10
            ? sensorConfig.actions.status[
                (event.state as GenericStatusState).status as
                  | 1
                  | 2
                  | 3
                  | 4
                  | 5
                  | 6
                  | 7
                  | 8
                  | 9
                  | 10
              ]
            : sensorConfig.actions.status.default
        if (action) {
          await performAction(action)
        }
        break
    }
  }
}
