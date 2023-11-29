import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return await createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  }

  async searchByName(search: string): Promise<Product[]> {
    const products = await this.productModel.find({
      name: new RegExp(search, 'i'),
    });
    return products;
  }

  async update(_id: string, updateProductDto: UpdateProductDto): Promise<any> {
    const product = await this.productModel.findByIdAndUpdate(
      { _id },
      updateProductDto,
    );
    return { message: 'Product updated successfully', product };
  }

  async remove(_id: string): Promise<any> {
    await this.productModel.findByIdAndDelete({ _id });
    return { message: 'Product removed successfully' };
  }
}
