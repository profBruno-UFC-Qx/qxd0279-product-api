import { ProductRepository } from "../v1/products.repository.js";
import { type Product } from "../v1/products.entity.js";
import { ProductService as ProductServiceWithoutPagination } from "../v1/products.service.js";
import type { PaginationMetaInfo } from "../../../shared/types.js";
import { decodeCursor, encodeCursor } from "../../../shared/cursor.js";

export class ProductService extends ProductServiceWithoutPagination{
  
  async getAllWithOffSet(offset: number, limit: number): Promise<{ data: Product[], total: number}> {
    const [data, total] = await ProductRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { id: "ASC" }
    })
    return { data, total }
  }
  
  
  async getAllByPage(page: number, pageSize: number): Promise<{ data: Product[], meta: PaginationMetaInfo}> {
    const offset = (page - 1) * pageSize
    console.log(offset, page, pageSize)
    const [data, total] = await ProductRepository.findAndCount({
      skip: offset,
      take: pageSize,
      order: { id: "ASC" }
    })
    return { 
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total/pageSize)
      }  
    }
  }

  async getByKeyset(afterId?: number, limit: number = 10): Promise<{ data: Product[], next: number | undefined}> {

    const qb = ProductRepository.createQueryBuilder("product")
    .orderBy("product.id", "ASC")
    .take(limit);

    if (afterId) {
      qb.where("product.id > :afterId", { afterId });
    }

    const data = await qb.getMany();

    return {
      data,
      next: data.length > 0 ? data[data.length - 1]?.id : undefined,
    };
  }

  async getByCreationTime(timestamp?: string, limit: number = 10): Promise<{ data: Product[], next: string | undefined}> {
  
    const qb = ProductRepository.createQueryBuilder("product")
    .orderBy("product.createdAt", "ASC")
    .take(limit);

    if (timestamp) {
      qb.where("product.createdAt > :after", { after: new Date(timestamp) });
    }

    const data = await qb.getMany();

    return {
      data,
      next: data.length > 0 ? data[data.length - 1]?.createdAt.toISOString() : undefined,
    };
  }

  async getByCursor(cursor?: string, limit: number = 10): Promise<{ data: Product[], next: string | undefined}> {

    let afterId: number | undefined;

    if (cursor) {
      const decoded = decodeCursor(cursor);
      afterId = decoded.id;
    }

    const res = await this.getByKeyset(afterId, limit)
    return {
      data: res.data,
      next: res.data.length
      ? encodeCursor({ id: res.data[res.data.length - 1]?.id })
      : undefined,
 
    }
  }

 }