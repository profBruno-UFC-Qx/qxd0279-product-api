import type { Request, Response } from "express";
import { ProductController as ProductControllerV1 } from "../v1/products.controller.js";
import { ProductService } from "./products.service.js";

export class ProductController extends ProductControllerV1 {
  constructor(protected productService = new ProductService()) {
    super(productService)
  }

  getAll = async (req: Request, res: Response) => {
    const { offset, limit } = req.query

    res.json(
      await this.productService.getAllWithOffSet(Number(offset) || 0, Number(limit)|| 10));
  }

}
