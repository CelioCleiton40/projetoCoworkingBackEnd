import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(Number(id));
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.updateProduct(Number(id), req.body);
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(Number(id));
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new ProductController();
