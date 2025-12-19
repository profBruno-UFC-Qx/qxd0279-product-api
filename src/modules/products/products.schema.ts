import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const createProduct = z.object({ 
  name: z.string('O campo nome é obrigatório').min(3, 'O tamanho mínimo é 3').openapi({
    example: 'Sanduicheira',
    description: 'Nome do produto'

  }),
  description: z.string().openapi({
    description: 'Sanduicheira de Inox super economica'
  }),
  price: z.number().positive().openapi({
    description: 'Número positivo'
  }),
  quantity: z.number().positive().openapi({ description: 'Quantidade de itens no estoque'}),
  image: z.url().openapi({
    description: 'URL da imagem armazenada no aws'
  })
});

export const productSchema = createProduct.extend({
  id: z.number().positive()
})
