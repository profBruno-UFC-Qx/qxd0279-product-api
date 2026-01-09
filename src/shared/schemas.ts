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

export const offsetPaginationQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const pagePaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi('Página desejada'),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).openapi('Número de items em uma página'),
});

export const keysetPaginationQuerySchema = z.object({
  cursor: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const timebasedPaginationQuerySchema = z.object({
  cursor: z.iso.datetime(),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const cursorPaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});