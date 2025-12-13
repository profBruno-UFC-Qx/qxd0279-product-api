import { type Product, ProductRepository } from "./products.repository.js";

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
 }

export const productService = new ProductService(new ProductRepository())