import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { GrpcController } from './grpc.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from 'proto/user.pb';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'proto/user.proto'),
          url: 'localhost:50051', // Cổng mà user_service đang listen
        },
      },
    ]),
  ],
  controllers: [GrpcController],
  providers: [AppService]
})
export class AppModule {}
