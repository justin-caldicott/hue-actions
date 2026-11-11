import { DeconzEvent } from './types'
import { getConfig } from './config'
import { getVirtualSensors, invalidateSensors } from './virtual-sensors'
import { performAction } from './actions'

export const sensorEventHandler = async (event: DeconzEvent) => {
  if (event.e === 'added' || event.e === 'deleted') {
    invalidateSensors()
    return
  }

  // Attribute and config events carry no state, so only state changes act.
  if (event.e !== 'changed' || event.id === undefined || !event.state) return
  const state = event.state
  // A sensor that has never been written has not changed state.
  if ('lastupdated' in state && state.lastupdated === 'none') return

  const config = getConfig()
  const sensors = await getVirtualSensors()
  const sensor = sensors[event.id]
  const sensorConfig =
    sensor !== undefined
      ? config.sensors.find(s => s.name === sensor.name)
      : undefined
  if (sensor === undefined || sensorConfig === undefined) return

  switch (sensorConfig.type) {
    case 'CLIPGenericFlag': {
      if (!('flag' in state)) return
      console.log(`Sensor ${sensor.name} state changed..`)
      await performAction(
        state.flag
          ? sensorConfig.actions.flag.true
          : sensorConfig.actions.flag.false
      )
      break
    }
    case 'CLIPGenericStatus': {
      if (!('status' in state)) return
      console.log(`Sensor ${sensor.name} state changed..`)
      const action =
        state.status >= 0 && state.status <= 10
          ? sensorConfig.actions.status[
              state.status as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
            ]
          : sensorConfig.actions.status.default
      if (action) {
        await performAction(action)
      }
      break
    }
  }
}
