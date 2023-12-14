#!/usr/bin/env node

import { startApi } from './api'
import { startListener } from './listener'

startApi()
startListener() // TODO: Async OK?
