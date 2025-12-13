import { z } from 'zod'

export const createProduct = z.object({ 
  name: z.string('O campo nome é obrigatório').min(3, 'O tamanho mínimo é 3'),
  description: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  image: z.url()
});
