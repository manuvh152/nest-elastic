<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Nest-Elastic

## Description
Elasticsearch implementation in NestJS using data scraped from Mercadolibre

## How to install
1. Clone repository

2. Install dependencies
```
npm i
```

3. Clone file ```.env.template``` and rename to ```.env```

4. Change the environment variables

5. Build postgres and elasticsearch containers
```
docker-compose up
```

6. Run API in development mode
```
npm run start:dev
```

7. Run seed
```
localhost:3000/api/seed
```

8. Go to Postman and fork the collection into your workspace

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/24980285-394aa71d-e916-4a8c-9962-17951b44b02c?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D24980285-394aa71d-e916-4a8c-9962-17951b44b02c%26entityType%3Dcollection%26workspaceId%3Dc341681c-e51e-4470-8bba-a54f2a2f8bc9)

