import { Controller, All, Req, Res, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';
import getRawBody from 'raw-body';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const url = this.routeToService(req.path);
    if (!url) throw new HttpException('Service not found', 404);

    const rawBody = await getRawBody(req);
    const result = await this.appService.proxyHttp(req, rawBody, url);
    return res.json(result);
  }

  private routeToService(path: string): string | null {
    if (path.startsWith('/auth')) return 'http://localhost:3001';
    if (path.startsWith('/user')) return 'http://localhost:3004';
    if (path.startsWith('/item')) return 'http://localhost:3003';
    if (path.startsWith('/detu')) return 'http://localhost:3002';
    return null;
  }
}