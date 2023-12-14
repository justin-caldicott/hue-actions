import * as z from 'zod'

const httpActionSchema = z.object({
  type: z.literal('http'),
  url: z.string(),
  method: z.enum(['POST', 'GET', 'PUT', 'PATCH', 'DELETE']),
  body: z.unknown(),
  // TODO: Headers
})

export type HttpAction = z.infer<typeof httpActionSchema>

const cmdActionSchema = z.object({
  type: z.literal('cmd'),
  command: z.string(),
  workingDirectory: z.string().optional(),
})

const seriesActionSchema = z.object({
  type: z.literal('series'),
  actions: z.array(z.object({})), // TODO: Recurse...
})

const parallelActionSchema = z.object({
  type: z.literal('parallel'),
  actions: z.array(z.object({})), // TODO: Recurse...
})

const randomActionSchema = z.object({
  type: z.literal('random'),
  withoutRepeats: z.boolean(),
  actions: z.array(z.object({})), // TODO: Recurse...
})

const actionSchema = z.discriminatedUnion('type', [
  httpActionSchema,
  cmdActionSchema,
  seriesActionSchema,
  parallelActionSchema,
  randomActionSchema,
])

export type Action = z.infer<typeof actionSchema>

export const configSchema = z.object({
  gatewayUrl: z.string().min(1),
  gatewayApiKey: z.string().min(1),
  sensors: z.array(
    z.union([
      z.object({
        name: z.string(),
        type: z.literal('CLIPGenericFlag'),
        actions: z.object({
          flag: z.object({
            true: actionSchema,
            false: actionSchema,
          }),
        }),
      }),
      z.object({
        name: z.string(),
        type: z.literal('CLIPGenericStatus'),
        actions: z.object({
          status: actionSchema,
        }),
      }),
    ])
  ),
})

export type Config = z.infer<typeof configSchema>

const baseSensorSchema = z.object({
  name: z.string().min(1),
  swversion: z.string().min(1),
  manufacturername: z.string().min(1),
  modelid: z.string().min(1),
  uniqueid: z.string().min(1),
})

export const createSensorSchema = baseSensorSchema.merge(
  z.object({
    type: z.union([
      z.enum(['CLIPGenericFlag', 'CLIPGenericStatus']),
      z.string().min(1),
    ]),
  })
)

const baseSensorStateSchema = z.object({
  lastupdated: z.string().min(1),
})

const genericFlagStateSchema = baseSensorStateSchema.merge(
  z.object({
    flag: z.boolean(),
  })
)

export type GenericFlagState = z.infer<typeof genericFlagStateSchema>

const genericStatusStateSchema = baseSensorStateSchema.merge(
  z.object({
    status: z.number(),
  })
)

export const getSensorSchema = z.union([
  z.discriminatedUnion('type', [
    baseSensorSchema.merge(
      z.object({
        type: z.literal('CLIPGenericFlag'),
        state: genericFlagStateSchema,
      })
    ),
    baseSensorSchema.merge(
      z.object({
        type: z.literal('CLIPGenericStatus'),
        state: genericStatusStateSchema,
      })
    ),
  ]),
  baseSensorSchema.merge(
    z.object({
      type: z.string().min(1),
    })
  ),
])

export type Sensor = z.infer<typeof getSensorSchema>

export const sensorsResponseSchema = z.record(
  z.string().min(1),
  getSensorSchema
)

export const deconzConfigSchema = z.object({
  websocketnotifyall: z.boolean(),
  websocketport: z.number(),
})

export type DeconzConfig = z.infer<typeof deconzConfigSchema>

export const deconzEventSchema = z.object({
  t: z.literal('event'),
  e: z.enum(['added', 'changed', 'deleted', 'scene-called']),
  r: z.enum(['groups', 'lights', 'scenes', 'sensors']),
  // TODO: Discriminated union
  id: z.string().optional(), // Not for scene-called events
  uniqueid: z.string().optional(), // Only for light and sensor resources
  state: z
    .union([genericFlagStateSchema, genericStatusStateSchema, z.object({})])
    .optional(),
})
// TODO: get this strict

export type DeconzEvent = z.infer<typeof deconzEventSchema>
