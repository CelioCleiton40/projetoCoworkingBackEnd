import { BaseDatabase } from "./BaseDataBase";
import { Product } from "../types/index";

export class ProductDatabase extends BaseDatabase {
    public static TABLE_PRODUCTS = "products";

    public async getAllProducts(): Promise<Product[]> {
        const products: Product[] = await BaseDatabase
            .connection(ProductDatabase.TABLE_PRODUCTS)
            .select();
        
        return products;
    }

    public async createProduct(newProduct: Product): Promise<void> {
        await BaseDatabase
            .connection(ProductDatabase.TABLE_PRODUCTS)
            .insert(newProduct);
    }

    public async getProductByName(name: string): Promise<Product | undefined> {
        const product: Product | undefined = await BaseDatabase
            .connection(ProductDatabase.TABLE_PRODUCTS)
            .where({ name })
            .first();
        
        return product;
    }

    public async getProductById(id: string): Promise<Product | undefined> {
        const product: Product | undefined = await BaseDatabase
            .connection(ProductDatabase.TABLE_PRODUCTS)
            .where({ id })
            .first();
        
        return product;
    }

    public async editProduct(id: string, updatedProduct: Partial<Product>): Promise<void> {
        await BaseDatabase
            .connection(ProductDatabase.TABLE_PRODUCTS)
            .where({ id })
            .update(updatedProduct);
    }

    public async deleteProduct(id: string): Promise<void> {
        await BaseDatabase
            .connection(ProductDatabase.TABLE_PRODUCTS)
            .where({ id })
            .delete();
    }
}
