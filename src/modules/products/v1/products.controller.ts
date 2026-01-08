import type { Request, Response } from "express";
import { ProductService } from "./products.service.js";

export class ProductController {
  constructor(protected productService: ProductService = new ProductService()) {}

  getAll = async (req: Request, res: Response) => {
    res.json({
      data: await this.productService.getAll(),
    });
  }

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = await this.productService.getById(id);
    if (product) {
      res.json({
        data: product,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  }

  add = async (req: Request, res: Response) => {
    const product = await this.productService.add(req.body);
    res.status(201).json({
      data: product,
    });
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = await this.productService.update(id, req.body);
    if (product) {
      res.json({
        data: product,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.productService.remove(id);
    if (result.affected) {
      res.status(204).json();
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  }
}
