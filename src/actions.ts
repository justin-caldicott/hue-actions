import got from 'got'
import { Action, CmdAction, HttpAction } from './types'
import { exec as execWithCallback } from 'child_process'
import util from 'util'

const exec = util.promisify(execWithCallback)

export const performAction = async (action: Action) => {
  console.log(`.. performing ${action.type} action`)
  switch (action.type) {
    case 'http':
      await performHttpAction(action)
      break
    case 'cmd':
      await performCmdAction(action)
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

const performCmdAction = async (action: CmdAction) => {
  try {
    const child = await exec(action.command, {
      cwd: action.workingDirectory,
    })

    console.log(`stderr: ${child.stderr.toString()}`)
    console.log(`stdout: ${child.stdout.toString()}`)
  } catch (err) {
    console.error(
      `Error when running command line action ${
        action.command
      } ${JSON.stringify(err)}`
    )
  }
}
