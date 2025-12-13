import type { Request, Response } from "express";
import { productService } from "./products.service.js";
import { createProduct } from "./products.schema.js";
import { ZodError } from "zod";

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
  res.json({
    data: product
  })
}