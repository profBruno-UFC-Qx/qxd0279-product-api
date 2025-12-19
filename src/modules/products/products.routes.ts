import { Router } from "express"
import { add, getAll, getById, update, remove } from "./products.controller.js"
import { validateBody, validateParams } from "../../middlewares/zodMiddleware.js"
import { createProduct, productSchema } from "./products.schema.js"
import { registry } from "../../docs/openapi.js"
import { idSchema, resCollectionEntitySchema, resSingleEntitySchema } from "../../shared/schemas.js"

const productsRouter = Router()


registry.registerPath({
  method: "get",
  path: "/products",
  description: "Retorna todos os produtos",
  responses: {
    200: {
      description: "Lista de produtos",
      content: {
        "application/json": {
          schema: resCollectionEntitySchema(createProduct)
        }
      }
    },
  },
  tags: ["Products"]
})

registry.registerPath({
  method: "get",
  path: "/products/{id}",
  description: "Retorna um produto pelo ID",
  request: {
    params: idSchema,
  },
  responses: {
    200: {
      description: "Produto",
      content: {
        "application/json": {
          schema: productSchema
        }
      }
    },
    404: {
      description: "Produto não encontrado"
    }
  },
  tags: ["Products"]
})

registry.registerPath({
  method: "post",
  path: "/products",
  description: "Cria um novo produto",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createProduct
        }
      }
    }
  },
  responses: {
    201: {
      description: "Produto criado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(createProduct)
        }
      }
    },
  },
  tags: ["Products"]
})

registry.registerPath({
  method: "put",
  path: "/products/{id}",
  description: "Atualiza um produto existente",
  request: {
    params: idSchema,
    body: {
      content: {
        "application/json": {
          schema: createProduct
        }
      }
    }
  },
  responses: {
    200: {
      description: "Produto atualizado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(createProduct)
        }
      }
    },
    404: {
      description: "Produto não encontrado"
    }
  },
  tags: ["Products"]
})

registry.registerPath({
  method: "delete",
  path: "/products/{id}",
  description: "Remove um produto",
  request: {
    params: idSchema
  },
  responses: {
    204: {
      description: "Produto removido com sucesso"
    },
    404: {
      description: "Produto não encontrado"
    }
  },
  tags: ["Products"]
})

productsRouter.get('/', getAll)
productsRouter.post('/', validateBody(createProduct), add)
productsRouter.get('/:id', validateParams(idSchema), getById)
productsRouter.put('/:id', validateParams(idSchema), validateBody(createProduct), update)
productsRouter.delete('/:id', validateParams(idSchema), remove)


export default productsRouter
