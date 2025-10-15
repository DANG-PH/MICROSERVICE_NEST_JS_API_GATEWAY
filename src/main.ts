import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './logger.config';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true, // 🚫 tắt auto parse body (cho proxy)
    logger: winstonLogger, // ⚡ Dùng Winston làm logger mặc định
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  // ✅ Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Tài liệu API tổng hợp của hệ thống')
    .setVersion('1.0')
    .addBearerAuth() // nếu có xác thực JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  // Bật validation cho tất cả request body/query/params
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // loại bỏ các field không có trong DTO
    forbidNonWhitelisted: true, // báo lỗi nếu gửi field lạ
    transform: true, // tự chuyển kiểu dữ liệu nếu cần
  }));

  await app.listen(3000);
  console.log(`🚀 Server đang chạy tại: http://localhost:3000`);
  console.log(`📘 Swagger tại: http://localhost:3000/api`);
}
bootstrap();

// comment
/*
whitelist: true -> DTO chỉ có username, password nhưng client gửi thêm role: 'admin' → sẽ bị bỏ.
forbidNonWhitelisted: true -> DTO có username & password, client gửi thêm role → trả lỗi 400 Bad Request: property role should not exist.
transform: true -> hoặc kiểu primitive được khai báo.
DTO có age: number, client gửi "age": "25" → sẽ tự chuyển "25" (string) thành 25 (number) trước khi vào controller.
*/