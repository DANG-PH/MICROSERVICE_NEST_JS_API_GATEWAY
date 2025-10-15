import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { GrpcController } from './grpc.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from 'proto/user.pb';
import { AppService } from './app.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
    }),
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'proto/user.proto'),
          url: process.env.USER_SERVICE_GRPC_URL
        },
      },
    ]),
  ],
  controllers: [GrpcController],
  providers: [AppService,JwtStrategy]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(GrpcController);
  }
}

//comment
/*
⚙️ Vì sao Interceptor ở main.ts, còn Middleware ở AppModule?

🟩 Middleware (ở cấp Express, chạy trước khi vào Nest):
Middleware hoạt động ở tầng HTTP thấp nhất (Express/Fastify).
Nest không thể dùng app.useGlobalMiddleware() vì không có hàm đó,
nên bắt buộc phải khai báo ở AppModule, nơi Nest ánh xạ route với Express.

🟦 Interceptor (ở cấp NestJS, chạy trong Nest):
Interceptor hoạt động sau khi request đã đi qua middleware, guard, pipe
và trước khi controller xử lý hoặc sau khi controller trả về dữ liệu.
*/

/*
Khi viết:
export class AppModule implements NestModule
thì mình đang nói với Nest rằng:
“Module này có sử dụng middleware, 
và anh (Nest) hãy gọi hàm configure() của tôi khi khởi động app nhé.”
*/
