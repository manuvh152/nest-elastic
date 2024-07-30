import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductSearchBody } from 'src/products/interfaces/product-search-body.interface';
import { ProductSearchResult } from 'src/products/interfaces/product-search-result.interface';

@Injectable()
export class SearchService {
  index = 'products';

  constructor(
    private readonly elasticSearchService: ElasticsearchService
  ) { }

  async indexPost(product: Product) {
    return this.elasticSearchService.index<ProductSearchBody>({
      index: this.index,
      body: {
        id: product.id,
        name: product.name,
        description: product.description,
        store: product.store,
        price: product.price,
        category: product.category,
        link: product.link,
        slug: product.slug
      },
    });
  }

  async search(searchQuery: SearchQueryDto) {
    const { query, limit = 10, offset = 0, min = 0, max, order } = searchQuery;
    let products = [];
    const body = await this.elasticSearchService.search<ProductSearchResult>({
      index: this.index,
      body: {
        from: offset,
        size: limit,
        sort: order ? { "price": order } : [],
        query: {
          bool: {
            must: {
              multi_match: {
                query: query,
                fields: [
                  'name^3', 'description', 'store^2', 'category^3'
                ]
              }
            },
            filter: [
              (max) ? {
                range: {
                  "price": {
                    gte: min,
                    lte: max
                  }
                }
              } : {
                range: {
                  "price": {
                    gte: min
                  }
                }
              }
            ]
          }
        }
      }
    });
    //console.log(body);
    const hits = body.hits.hits;
    hits.forEach(item => products.push(item._source));
    //console.log(products.length)
    return products;
  }

  async remove(id: string) {
    this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: id
          }
        }
      }
    });
  }

  async update(id: string, updatedProduct: Product) {
    const product: ProductSearchBody = {
      id: id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      store: updatedProduct.store,
      category: updatedProduct.category,
      link: updatedProduct.link,
      slug: updatedProduct.slug
    }

    const script = Object.entries(product).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: id
          }
        },
        script: script
      }
    });
  }

  async removeAllIndices(){
    this.elasticSearchService.deleteByQuery({
      index: '_all',
      body: {
        query: {
          match_all: {}
        }
      }
    });
  }

}
