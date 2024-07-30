import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { SearchService } from 'src/search/search.service';
import { dataSeed } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly productsService: ProductsService,
    private readonly searchService: SearchService
  ) {}

  async runSeed() {
    try {
      await this.deleteEverything();

      await this.insertProducts();

      console.log('SEED EXECUTED');
      return 'SEED EXECUTED';
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs')
    }
  }

  private async deleteEverything() {
    await this.searchService.removeAllIndices();
    await this.productsService.deleteAllProducts();
  }

  private async insertProducts() {
    const seedProducts = dataSeed;

    const insertPromises = [];

    seedProducts.forEach(product => {
      insertPromises.push(this.productsService.create(product))
    });

    await Promise.all(insertPromises);

    return true;
  }

}
