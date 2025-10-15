import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`${req.method} ${req.url} - ${duration}ms`);
      }),
    );
  }
}

/*
🧩 Giải thích flow:
start được lấy trước khi request xử lý.
next.handle() chạy request thật (controller + service).
Khi xử lý xong, tap() được gọi → tính duration.
Ghi log bằng this.logger.log().

context: ExecutionContext là ngữ cảnh thực thi (execution context) mà NestJS tự động truyền vào interceptor.
Nó chứa toàn bộ thông tin về request hiện tại — ví dụ:
Nếu là HTTP request: chứa req, res, user, headers, v.v...
Nếu là RPC (microservice): chứa message pattern, payload, v.v...
Nếu là WebSocket: chứa socket client, data, v.v...


pipe: “Lấy luồng dữ liệu của response 
và xử lý thêm (bổ sung logic, log, biến đổi dữ liệu...) trước khi trả về client.”
Nếu không dùng .pipe(), interceptor vẫn chạy, nhưng 
bạn không thể can thiệp vào kết quả response hoặc thời điểm request kết thúc.
Ví dụ: bạn không thể tính thời gian xử lý hoặc ghi log khi hoàn tất 
— vì bạn không “nghe” được lúc response trả về.

tóm lại pipe là để khi dữ liệu chảy qua tôi sẽ làm gì với dữ liệu, 
còn subscribe là để đăng ký lắng nghe dữ liệu đó
tức là sau khi subscribe dữ liệu observable sẽ chảy và mỗi lần chảy sẽ đc pipe thay đổi data 
hoặc làm gì đó và sau đó sẽ truyền cái lắng nghe đến subscribe in ra cái mình viết ở subscribe 
còn nếu k subscribe thì dữ liệu sẽ k chảy
*/

/* 
Vì sao k cần subscribe observable data ở đây ??
vì nest js sẽ tự subscribe nên nếu ta subcribe ở đây sẽ làm ngắt luồng chảy data của nest
Request
 ↓
Middleware  (Express)
 ↓
Guards
 ↓
Interceptors (trước)
 ↓
Controller (return data)
 ↓
Interceptors (sau)
 ↓
Nest core subscribe() và gửi Response
*/
