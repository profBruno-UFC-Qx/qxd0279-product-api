import type { Request, Response } from "express"
import { productService } from "./products.service.js"

export async function getAll(req: Request, res: Response) {
  res.json({
    data: await productService.getAll()
  })
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id)
  try {
    const product = await productService.getById(id)
    res.json({ 
      data: product 
    })
  } catch(e) {
    res.status(404).json({
      message: 'Product not found'
    })
  }
}

export async function add(req: Request, res: Response) {

  const product = await productService.add(req.body)
  res.status(201).json({
    data: product
  })
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id)
  const product = await productService.update(id, req.body)
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

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id)
  const product = await productService.remove(id, req.body)
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

