import type { Request, Response } from "express";
import { ProductService } from "./products.service.js";
import { ProductController as ProductControllerV1 } from "../v1/products.controller.js";

export class ProductController extends ProductControllerV1 {
  constructor(protected productService: ProductService = new ProductService()) {
    super(productService)
  }

  getAll = async (req: Request, res: Response) => {
    // OffsetBased - Pagination
    // const { offset, limit } = res.locals.query
    // res.json(await this.productService.getAllWithOffset(offset, limit));

    // PageBased - Pagination
    //const { page, pageSize } = res.locals.query
    //res.json(await this.productService.getAllByPage(page, pageSize));

    // Keyset - Pagination
    // const { cursor, limit } = res.locals.query
    // res.json(await this.productService.getByKeyset(cursor, limit));

    // Timebased - Pagination
    // const { cursor, limit } = res.locals.query
    // res.json(await this.productService.getByCreationTime(cursor, limit))

    // CursorBased
    const { cursor, limit } = res.locals.query
    res.json(await this.productService.getByCursor(cursor, limit))
  };
}
