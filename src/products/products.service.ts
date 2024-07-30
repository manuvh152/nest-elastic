import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { SearchService } from 'src/search/search.service';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly searchService: SearchService
  ){}
  
  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);
      this.searchService.indexPost(product);

      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createBulk(createProductBulkDto: CreateProductDto[]){
    
    const insertPromises = [];

    createProductBulkDto.forEach( product => {
      insertPromises.push(this.create(product));
    });

    await Promise.all(insertPromises);

    return true;

  }

  async findAll(searchQueryDto: SearchQueryDto) {
    try {
      
      const { limit = 10, offset = 0, min = 0, max, order } = searchQueryDto;

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        where: (!max) ? {
          price: MoreThanOrEqual(min)
        } : {
          price: Between(min, max)
        },
        order: {
          price: order
        }
      });

      return products;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findOne(id: string) {
    try {
      
      const product: Product = await this.productRepository.findOneBy({id});

      if(!product){
        return new NotFoundException(`Product with id ${id} not found`);
      }

      return product;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if(!product){
      throw new NotFoundException(`Product with "${id}" not found`)
    }

    await this.searchService.update(id, product);
    return await this.productRepository.update({id}, product);

  }

  async remove(id: string) {
    const deleteResponse = await this.productRepository.delete(id);
    if( !deleteResponse.affected ){
      throw new NotFoundException(id);
    }
    return await this.searchService.remove(id);
  }

  async search(searchQuery: SearchQueryDto){
    const results = await this.searchService.search(searchQuery);
    const ids = results.map(result => result.id);
    if(!ids.length){
      return [];
    }

    return results;
  }

  async findCategories(){
    const categories = await this.productRepository.find({
      select: ['category']
    });

    return categories;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async deleteAllProducts(){

    const query = this.productRepository.createQueryBuilder('products');

    try {
      
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

}
