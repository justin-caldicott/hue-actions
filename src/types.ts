import * as z from 'zod'

// TODO
const actionSchema = z.union([
  z.object({
    type: z.literal('http'),
    url: z.string(),
    method: z.enum(['POST', 'GET', 'PUT', 'PATCH', 'DELETE']),
    body: z.object({}),
    // TODO: Headers
  }),
  z.object({
    type: z.literal('cmd'),
    command: z.string(),
    workingDirectory: z.string().optional(),
  }),
  z.object({
    type: z.literal('series'),
    actions: z.array(z.object({})), // TODO: Recurse...
  }),
  z.object({
    type: z.literal('parallel'),
    actions: z.array(z.object({})), // TODO: Recurse...
  }),
  z.object({
    type: z.literal('random'),
    withoutRepeats: z.boolean(),
    actions: z.array(z.object({})), // TODO: Recurse...
  }),
])

export const configSchema = z.object({
  gatewayUrl: z.string(),
  gatewayApiKey: z.string(),
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

export const resourceKindSchema = z.union([
  z.literal('light'),
  z.literal('group'),
  z.literal('rule'),
  z.literal('sensor'),
  z.literal('schedule'),
])

export type ResourceKind = z.infer<typeof resourceKindSchema>

export const resourceSchema = z.object({
  name: z.string(),
})

export type Resource = z.infer<typeof resourceSchema>

export const resourcesResponseSchema = z.record(
  z.string().min(1),
  resourceSchema
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
})
// TODO: get this strict

export type DeconzEvent = z.infer<typeof deconzEventSchema>
