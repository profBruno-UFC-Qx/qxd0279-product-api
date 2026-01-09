import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const offsetPaginationQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const pagePaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(1).openapi('Página desejada'),
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
