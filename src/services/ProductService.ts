import ProductModel from '../models/Product';
import { Product } from '../types';

class ProductService {
  public async createProduct(data: Product): Promise<Product> {
    return await ProductModel.create(data);
  }

  public async getProductById(id: number): Promise<Product | null> {
    const product = await ProductModel.getById(id);
    return product ?? null;
  }

  public async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await ProductModel.update(id, data);
    return product ?? null;
  }

  public async deleteProduct(id: number): Promise<void> {
    await ProductModel.delete(id);
  }
}

export default new ProductService();
