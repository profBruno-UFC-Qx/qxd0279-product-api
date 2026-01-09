import { ProductRepository } from "./products.repository.js";
import { type Product } from "./products.entity.js";

export class ProductService {
  
  async getAll(): Promise<Product[]> {
    return ProductRepository.find()
  }

  async getById(id: number): Promise<Product | null> {
    return ProductRepository.findOneBy({ id })
  }

  async add(product: Omit<Product, 'id'>): Promise<Product | null> {
    const result = await ProductRepository.insert(product)
    if(result.identifiers.length == 1 ) {
      return { id: result.raw.insertId, ...product }
    }
    return null
  }
 

  async update(id: number, product: Omit<Product, 'id'>): Promise<Product | undefined> {
    const toUpdateProduct = {
      id,
      ...product
    }
    return ProductRepository.save(toUpdateProduct)
  }

  async remove(id: number) {
    return ProductRepository.delete(id)
  }

 }