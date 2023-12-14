import got from 'got'
import { Action, HttpAction } from './types'

export const performAction = async (action: Action) => {
  console.log(`.. performing ${action.type} action`)
  switch (action.type) {
    case 'http':
      await performHttpAction(action)
      break
    default:
      throw new Error(`Unsupported action type ${action.type}`)
  }
}

const performHttpAction = async (action: HttpAction) => {
  await got(action.url, {
    method: action.method,
    body: JSON.stringify(action.body),
  })
}
