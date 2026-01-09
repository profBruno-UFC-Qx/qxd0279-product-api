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
  return resCollectionEntitySchema(schema).extend({
    total: z.number().int()
  })
}

export const resCollectionEntitySchemaWithPages = (schema: ZodType) => {
  return resCollectionEntitySchema(schema).extend({
    meta: z.object({
      page: z.number().int().openapi('Página atual'),
      pageSize: z.number().int().openapi('Número de items na página'),
      pageCount: z.number().int().openapi('Número total de páginas'),
      total: z.number().int().openapi('Número total de items')

    })
  })
}

export const resCollectionEntitySchemaWithKeySet = (schema: ZodType) => {
  return resCollectionEntitySchema(schema).extend({
    next: z.number().int()
  })
}

export const resCollectionEntitySchemaWithTimestamp = (schema: ZodType) => {
  return resCollectionEntitySchema(schema).extend({
    next: z.iso.datetime()
  })
}

export const resCollectionEntitySchemaWithCursor = (schema: ZodType) => {
  return resCollectionEntitySchema(schema).extend({
    next: z.string()
  })
}