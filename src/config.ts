import os from 'os'
import * as fse from 'fs-extra'
import { Config, configSchema } from './types'

const configPath = `${os.homedir()}/.hue-actions`

let configInstance: Config | null = null

const readConfig = () =>
  configSchema.parse(
    fse.existsSync(configPath) ? fse.readJSONSync(configPath) : {}
  )

const writeConfig = (config: Config) => {
  fse.writeJSONSync(configPath, config)
}

export const getConfig = () => {
  const config = configInstance ?? readConfig()
  configInstance = config
  return config
}

export const updateConfig = (config: Config) => {
  configInstance = config
  writeConfig(config)
  console.log('Config updated', JSON.stringify(config))
}
