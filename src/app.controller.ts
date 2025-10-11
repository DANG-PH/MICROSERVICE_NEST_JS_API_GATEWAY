import { Controller, All, Req, HttpException, Logger ,Res} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { Request , Response} from 'express';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import getRawBody from 'raw-body';
import { Observable } from 'rxjs';
import { LoginResponse , LoginRequest, USER_PACKAGE_NAME, USER_SERVICE_NAME, TokenRequest, UserResponse, BalanceResponse, AddBalanceRequest, UseItemRequest, MessageResponse, UserServiceClient, UserServiceController} from 'proto/user.pb';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  private userGrpcService: UserServiceClient;

  constructor(
    private readonly http: HttpService,
    @Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService = this.client.getService(USER_SERVICE_NAME);
  }

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const url = this.routeToService(req.path);

    // Nếu route dành cho user thì gọi gRPC thay vì HTTP
    if (req.path.startsWith('/user/grpc/register')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await firstValueFrom(
        this.userGrpcService.register({
          username : body.username,
          password : body.password
        })
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/login')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      console.log('📥 Nhận login:', body);

      try { 
        const result = await lastValueFrom(
          this.userGrpcService.login({
            username: body.username,
            password: body.password,
          }),
        );

        console.log('✅ Raw result:', result);
        const json = JSON.parse(JSON.stringify(result));
        console.log('✅ Gửi trả client (JSON):', json);

        return res.json(json);
      } catch (err) {
        console.error('❌ Lỗi khi gọi gRPC Login:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
    if (req.path.startsWith('/user/grpc/profile')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await lastValueFrom(
        this.userGrpcService.getProfile({
          token : body.token
        }),
      );

      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }

    if (req.path.startsWith('/user/grpc/addVangNapTuWeb')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await firstValueFrom(
        this.userGrpcService.addVangNapTuWeb({
          username : body.username,
          amount : body.amount
        })
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/addNgocNapTuWeb')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await firstValueFrom(
        this.userGrpcService.addNgocNapTuWeb({
          username : body.username,
          amount : body.amount
        })
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/addItemWeb')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await firstValueFrom(
        this.userGrpcService.addItemWeb({
          username : body.username,
          itemId : body.itemId
        })
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/getItemWeb')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await firstValueFrom(
        this.userGrpcService.getItemsWeb({
          username : body.username,
        })
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/useItemWeb')) {
      const raw = await getRawBody(req);
      const body = JSON.parse(raw.toString());
      const result = await firstValueFrom(
        this.userGrpcService.useItemWeb({
          username : body.username,
          itemId : body.itemId
        })
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/getTop10BySucManh')) {
      const result = await firstValueFrom(
        this.userGrpcService.getTop10BySucManh({})
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    if (req.path.startsWith('/user/grpc/getTop10ByVang')) {
      const result = await firstValueFrom(
        this.userGrpcService.getTop10ByVang({})
      ) 
      const json = JSON.parse(JSON.stringify(result));

      return res.json(json);
    }
    // Ngược lại, chuyển tiếp HTTP như cũ
    if (!url) throw new HttpException('Service not found', 404);

    const fullUrl = `${url}${req.path}`;
    this.logger.log(`➡ Proxy to: ${fullUrl}`);

    const rawBody = await getRawBody(req);

    const response = this.http.request({
      method: req.method,
      url: fullUrl,
      data: rawBody,
      headers: req.headers,
    });

    const result = await lastValueFrom(response);
    return result.data;
  }

  private routeToService(path: string): string | null {
    if (path.startsWith('/auth')) return 'http://localhost:3001';
    if (path.startsWith('/user')) return 'http://localhost:3004';
    if (path.startsWith('/item')) return 'http://localhost:3003';
    if (path.startsWith('/detu')) return 'http://localhost:3002';
    return null;
  }
}


// NestJS lifecycle	LibGDX lifecycle
// constructor()	new MyGame() (chưa có gì render được)
// onModuleInit()	show() (chuẩn bị tài nguyên, khởi tạo đối tượng)
// onApplicationBootstrap()	render() bắt đầu vòng lặp game
// onModuleDestroy()	dispose() giải phóng tài nguyên