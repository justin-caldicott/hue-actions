#!/usr/bin/env node

import { Command } from 'commander'
import { readConfig, writeConfig } from './config'
import { service } from './service'
import { registration } from './registration'

// TODO: Ideally have hue-actions.ts called index.ts and hue-actions-launch.ts as just launch.ts

const program = new Command()

program
  .version(require('../package.json').version)
  .description(
    'Simple binding of CLIP sensor state to http and command line actions.'
  )

program
  .command('start')
  .description('watch for CLIP sensor changes and run actions')
  .action(options => service()) // TODO: It's async

program
  .command('register')
  .description(
    'register a background service to watch for CLIP sensor changes and run actions'
  )
  .action(options => registration({ action: 'register' })) // TODO: It's async

program
  .command('unregister')
  .description(
    'unregister a background service to watch for CLIP sensor changes and run actions'
  )
  .action(options => registration({ action: 'unregister' })) // TODO: It's async

const gateway = program
  .command('gateway')
  .description('manage the gateway used for deployment')

gateway
  .command('set <host> <apiKey>')
  .description('set the gateway to host the CLIP sensors')
  .action((host: string, apiKey: string) => {
    writeConfig({ ...readConfig(), gatewayHost: host, gatewayApiKey: apiKey })
  })

gateway
  .command('get')
  .description('get the gateway to host the CLIP sensors')
  .action(() => {
    const { gatewayHost, gatewayApiKey } = readConfig()
    const gateway = {
      host: gatewayHost,
      apiKey: gatewayApiKey
        ? `${gatewayApiKey.substring(0, 4)}********`
        : undefined,
    }
    console.log(JSON.stringify(gateway))
  })

program.parse(process.argv)
