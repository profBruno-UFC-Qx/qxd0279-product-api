import { ProductRepository } from "./products.repository.js";
import { type Product } from "./products.repository.js";

class ProductService {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  getAll(): Product[] {
    return this.repository.find()
  }

  getById(id: number): Product {
    const product = this.repository.findById(id)
    if (product) {
      return product
    } 
    throw Error("Product not found")
  }

  add(product: Omit<Product, 'id'>): Product {
    return this.repository.add(product)
  }
 

  update(id: number, product: Omit<Product, 'id'>): Product | undefined {
    const toUpdateProduct = {
      id,
      ...product
    }
    return this.repository.update(toUpdateProduct)
  }

  remove(id: number, product: Omit<Product, 'id'>): Product | undefined {
    const toUpdateProduct = {
      id,
      ...product
    }
    return this.repository.remove(toUpdateProduct)
  }

 }




export const productService = new ProductService(new ProductRepository())