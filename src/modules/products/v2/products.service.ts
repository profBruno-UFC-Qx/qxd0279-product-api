import { ProductRepository } from "../v1/products.repository.js";
import { type Product } from "../v1/products.entity.js";
import { ProductService as ProductServiceWithoutPagination } from "../v1/products.service.js";

export class ProductService extends ProductServiceWithoutPagination{
  
  async getAllWithOffSet(offset: number, limit: number): Promise<{ data: Product[], total: number}> {
    const [data, total] = await ProductRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { id: "ASC" }
    })

    return { data, total }
  }

 }