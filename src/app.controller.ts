import { Controller, All, Req, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request } from 'express';
import { lastValueFrom, timeout, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import getRawBody from 'raw-body';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly http: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request) {
    const url = this.routeToService(req.path);

    console.log('➡️ Forward:', req.method, req.url, req.body);

    if (!url) throw new HttpException('Service not found', 404);

    const fullUrl = `${url}${req.path}`;
    this.logger.log(`➡ Proxy to: ${fullUrl}`);

    const rawBody = await getRawBody(req);

    const response = this.http.request({
      method: req.method,
      url: fullUrl,
      data: rawBody,
      headers: req.headers,
    })

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


// Ví dụ client gửi request:

// POST http://localhost:3000/api/auth/login
// Body: { "username": "dang", "password": "123" }
// Headers: { "Content-Type": "application/json" }


// Khi đến proxy():

// req.method    // "POST"
// req.path      // "/auth/login"
// req.body      // { username: "dang", password: "123" }
// req.headers   // { content-type: "application/json", ... }


// Cú pháp	Dùng khi	Giải thích
// import { X } from 'pkg'	X được dùng ở runtime	ví dụ: class, hàm, biến
// import type { X } from 'pkg'	X chỉ dùng để định nghĩa kiểu	không tạo import thật khi biên dịch JS


// ở đây chúng ta xài getRawBody để đọc buffer( dãy nhị phân đc mã hóa từ json client gửi ) từ steam
// k dùng bodyParser để đọc vì k có cơ chế await để đọc đủ data gửi đi, còn bodyParser mà true thì nó cũng đọc từ steam nhưng k có await nên thiếu dữ liệu và dữ liệu cần mã hóa lại khi gửi cho service khác còn raw buffer thì ko cần vì đã mã hóa 1 lần lúc client gửi cho api gate way rồi cứ thế gửi đi cho service khác
