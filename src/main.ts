import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Student Management API')
    .setDescription('API for managing students')
    .setVersion('1.0')
    .addTag('students')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Enable CORS (optional, useful for frontend integration)
  app.enableCors();

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}

void bootstrap();
