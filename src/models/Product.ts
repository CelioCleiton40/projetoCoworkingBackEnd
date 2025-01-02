import DatabaseConnection from '../config/database';
import { Product } from '@/types';

const db = new DatabaseConnection();

class ProductModel {
  public async create(product: Product): Promise<Product> {
    const query = `
      INSERT INTO products (name, description, price, stock, min_stock, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    const { id } = await db.run(query, [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.min_stock
    ]);
    return { id, ...product, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }

  public async getById(id: number): Promise<Product | undefined> {
    const product = await db.get<Product>(`SELECT * FROM products WHERE id = ?`, [id]);
    return product;
  }

  public async getAll(): Promise<Product[]> {
    const products = await db.all<Product>(`SELECT * FROM products`);
    return products;
  }

  public async update(id: number, product: Partial<Product>): Promise<Product | undefined> {
    const query = `
      UPDATE products
      SET name = ?, description = ?, price = ?, stock = ?, min_stock = ?, updated_at = datetime('now')
      WHERE id = ?`;
    await db.run(query, [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.min_stock,
      id
    ]);
    const updatedProduct = await this.getById(id);
    return updatedProduct;
  }

  public async delete(id: number): Promise<void> {
    await db.run(`DELETE FROM products WHERE id = ?`, [id]);
  }
}

export default new ProductModel();
