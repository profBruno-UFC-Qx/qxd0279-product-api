import type { Request, Response } from "express"
import { productService } from "./products.service.js"

export function getAll(req: Request, res: Response) {
  res.json({
    data: productService.getAll()
  })
}

export function getById(req: Request, res: Response) {
  const id = Number(req.params.id)
  try {
    const product = productService.getById(id)
    res.json({ 
      data: product 
    })
  } catch(e) {
    res.status(404).json({
      message: 'Product not found'
    })
  }
}

export function add(req: Request, res: Response) {

  const product = productService.add(req.body)
  res.status(201).json({
    data: product
  })
}

export function update(req: Request, res: Response) {
  const id = Number(req.params.id)
  const product = productService.update(id, req.body)
  if(product) {
      res.json({
        data: product
    })
  } else {
    res.status(404).json({
      success: false,
          error: {
            message: "Produto não existe",
            details: [],
            code: 400
          },
    })
  }
}

export function remove(req: Request, res: Response) {
  const id = Number(req.params.id)
  const product = productService.remove(id, req.body)
  if(product) {
      res.status(204).json()
  } else {
    res.status(404).json({
      success: false,
          error: {
            message: "Produto não existe",
            details: [],
            code: 400
          },
    })
  }
}

