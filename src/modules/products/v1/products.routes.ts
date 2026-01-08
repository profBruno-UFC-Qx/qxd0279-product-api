import { Router } from "express"
import { ProductController } from "./products.controller.js"
import { validateBody, validateParams } from "../../../middlewares/zodMiddleware.js"
import { createProduct, productSchema } from "./products.schema.js"
import { registry } from "../../../docs/openapi.js"
import { idSchema, resCollectionEntitySchema, resSingleEntitySchema } from "../../../shared/schemas.js"

const productsRouter = Router()


registry.registerPath({
  method: "get",
  path: "/v1/products",
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
  tags: ["Products", "V1"]
})

registry.registerPath({
  method: "get",
  path: "/v1/products/{id}",
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
  tags: ["Products", "V1"]
})

registry.registerPath({
  method: "post",
  path: "/v1/products",
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
  tags: ["Products", "V1"]
})

registry.registerPath({
  method: "put",
  path: "/v1/products/{id}",
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
  tags: ["Products", "V1"]
})

registry.registerPath({
  method: "delete",
  path: "/v1/products/{id}",
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
  tags: ["Products", "V1"]
})

const productController = new ProductController()

productsRouter.get('/', productController.getAll)
productsRouter.post('/', validateBody(createProduct), productController.add)
productsRouter.get('/:id', validateParams(idSchema), productController.getById)
productsRouter.put('/:id', validateParams(idSchema), validateBody(createProduct), productController.update)
productsRouter.delete('/:id', validateParams(idSchema), productController.remove)


export default productsRouter
