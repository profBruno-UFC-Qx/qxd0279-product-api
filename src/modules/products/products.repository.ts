export type Product = {
  id: number,
  name: string,
  description: string,
  price: number,
  quantity: number
  image: string
}

const products: Product[] = [{
  id: 1,
  name: "Produto 1",
  description: "Sei la",
  price: 10.0,
  quantity: 1,
  image: "public/item.jpg"
}]

export class ProductRepository {

  find(): Product[] {
    return products
  }

  findById(id: number): Product | undefined {
    return products.find((item) => item.id === id)
  }

  add(product: Omit<Product, 'id'>): Product {
    let nextId = 0
    if(products.length === 0) {
      nextId = 1
    } else {
      let last = products.slice(-1)
      nextId = last[0] ? last[0].id + 1 : 1
    }
    const newProduct: Product = {
      ...product,
      id: nextId
    }
    products.push(newProduct)
    return newProduct
  }

  remove(product: Product): Product | undefined {
    const toRemove = products.findIndex((p) => p.id == product.id)
    return products.splice(toRemove, 1).at(0)
  }

  update(product: Product): Product | undefined {
    const toUpdate = products.findIndex((p) => p.id == product.id)
    if(toUpdate != -1) {
      products[toUpdate] = product
      return product
    }
    return undefined
  }
  
}