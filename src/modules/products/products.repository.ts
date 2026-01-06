import { AppDataSource } from "../../config/datasource.js"
import { Product } from "./products.entity.js";

export const ProductRepository = AppDataSource.getRepository(Product).extend({
  findByName(name: string) {
    return this.findOneBy({ name });
  }
});