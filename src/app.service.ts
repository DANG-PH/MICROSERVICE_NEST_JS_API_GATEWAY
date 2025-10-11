import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import getRawBody from 'raw-body';
import {
  RegisterRequest,
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'proto/user.pb';
import { Request } from 'express';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private userGrpcService: UserServiceClient;

  constructor(
    private readonly http: HttpService,
    @Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async handleRegister(req: RegisterRequest) {
    this.logger.debug('Body nhận được: ' + JSON.stringify(req));
    return await firstValueFrom(this.userGrpcService.register(req));
  }

  async handleLogin(req: Request) {
    const body = await this.parse(req);
    return await lastValueFrom(this.userGrpcService.login(body));
  }

  async handleProfile(req: Request) {
    const body = await this.parse(req);
    return await lastValueFrom(this.userGrpcService.getProfile({ token: body.token }));
  }

  async handleAddVang(req: Request) {
    const body = await this.parse(req);
    return await firstValueFrom(this.userGrpcService.addVangNapTuWeb(body));
  }

  async handleAddNgoc(req: Request) {
    const body = await this.parse(req);
    return await firstValueFrom(this.userGrpcService.addNgocNapTuWeb(body));
  }

  async handleAddItem(req: Request) {
    const body = await this.parse(req);
    return await firstValueFrom(this.userGrpcService.addItemWeb(body));
  }

  async handleGetItems(req: Request) {
    const body = await this.parse(req);
    return await firstValueFrom(this.userGrpcService.getItemsWeb(body));
  }

  async handleUseItem(req: Request) {
    const body = await this.parse(req);
    return await firstValueFrom(this.userGrpcService.useItemWeb(body));
  }

  async handleTop10BySucManh() {
    return await firstValueFrom(this.userGrpcService.getTop10BySucManh({}));
  }

  async handleTop10ByVang() {
    return await firstValueFrom(this.userGrpcService.getTop10ByVang({}));
  }

  async proxyHttp(req: Request, rawBody: Buffer, url: string) {
    const fullUrl = `${url}${req.path}`;
    this.logger.log(`➡ Proxy to: ${fullUrl}`);
    const response = this.http.request({
      method: req.method,
      url: fullUrl,
      data: rawBody,
      headers: req.headers,
    });
    const result = await lastValueFrom(response);
    return result.data;
  }

  private async parse(req: Request) {
    const raw = await getRawBody(req);
    return JSON.parse(raw.toString());
  }
}