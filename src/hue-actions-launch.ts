#!/usr/bin/env node

import { startApi } from './api'
import { getConfig } from './config'
import { startListener } from './listener'

if (getConfig().gatewayApiKey === undefined) {
  throw new Error('Cannot start, gateway info not set')
}

startApi()
startListener() // TODO: Async OK?
