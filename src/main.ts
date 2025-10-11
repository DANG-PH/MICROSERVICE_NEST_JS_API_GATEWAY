import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true, // 🚫 tắt auto parse body (cho proxy)
  });

  // ✅ Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Tài liệu API tổng hợp của hệ thống')
    .setVersion('1.0')
    .addBearerAuth() // nếu có xác thực JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`🚀 Server đang chạy tại: http://localhost:3000`);
  console.log(`📘 Swagger tại: http://localhost:3000/api`);
}
bootstrap();