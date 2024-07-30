import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [ProductsModule, SearchModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
