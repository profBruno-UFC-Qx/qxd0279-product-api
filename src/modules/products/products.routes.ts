import { Router } from "express"
import { add, getAll, getById } from "./products.controller.js"
import { validate } from "../../middlewares/zodMiddleware.js"
import { createProduct } from "./products.schema.js"

const productsRouter = Router()

productsRouter.get('/', getAll)
productsRouter.get('/:id', getById)
productsRouter.post('/', validate(createProduct), add)
// productsRouter.put('/:id', getAll)
// productsRouter.delete('/:id', getAll)


export default productsRouter

