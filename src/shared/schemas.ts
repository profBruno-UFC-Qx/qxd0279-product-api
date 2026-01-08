import { z, ZodType } from 'zod'

export const idSchema = z.object({
  id: z.coerce.number().int()
})

export const resSingleEntitySchema = (schema: ZodType) => {
  return z.object({
    success: z.boolean(),
    data: schema
  })
}

export const resCollectionEntitySchema = (schema: ZodType) => {
  return z.object({
    success: z.boolean(),
    data: z.array(schema)
  })
}

export const resCollectionEntitySchemaWithTotal = (schema: ZodType) => {
  resCollectionEntitySchema(schema).extend({
    total: z.number().int()
  })
}