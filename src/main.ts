import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //config swagger
  const docConfig = new DocumentBuilder()
    .setTitle('Reat Estate Invest API')
    .setDescription('Reat Estate Invest API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(process.env.API_PORT);
}
bootstrap();
