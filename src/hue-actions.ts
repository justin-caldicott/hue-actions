#!/usr/bin/env node

import { Command } from 'commander'
import { getConfig, updateConfig } from './config'
import { startListener } from './listener'
import { registration } from './registration'
import { startApi } from './api'

// TODO: Ideally have hue-actions.ts called index.ts and hue-actions-launch.ts as just launch.ts

const program = new Command()

program
  .version(require('../package.json').version)
  .description(
    'Simple binding of CLIP sensor state to http and command line actions.'
  )

program
  .command('start')
  .description('start API and listener')
  .action(options => {
    startApi()
    startListener()
  }) // TODO: It's async

program
  .command('register')
  .description('register a background service with API and listener')
  .action(options => registration({ action: 'register' })) // TODO: It's async

program
  .command('unregister')
  .description('unregister the background service with API and listener')
  .action(options => registration({ action: 'unregister' })) // TODO: It's async

// TODO: Consider this being managed via the API
const gateway = program
  .command('gateway')
  .description('manage the gateway used for deployment')

gateway
  .command('set <host> <apiKey>')
  .description('set the gateway to host the CLIP sensors')
  .action((url: string, apiKey: string) => {
    updateConfig({ ...getConfig(), gatewayUrl: url, gatewayApiKey: apiKey })
  })

gateway
  .command('get')
  .description('get the gateway to host the CLIP sensors')
  .action(() => {
    const { gatewayUrl, gatewayApiKey } = getConfig()
    const gateway = {
      url: gatewayUrl,
      apiKey: gatewayApiKey
        ? `${gatewayApiKey.substring(0, 4)}********`
        : undefined,
    }
    console.log(JSON.stringify(gateway))
  })

program.parse(process.argv)
