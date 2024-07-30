import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD')
        },
        maxRetries: configService.get('ELASTICSEARCH_MAX_RETRIES'),
        requestTimeout: configService.get('ELASTICSEARCH_REQ_TIMEOUT'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [SearchService,],
  exports: [ElasticsearchModule, SearchService]
})
export class SearchModule{}
