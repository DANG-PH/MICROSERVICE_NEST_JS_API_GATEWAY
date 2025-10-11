import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody,ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginRequest, RegisterRequest,TokenRequest } from 'dto/grpc.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user/grpc')
@ApiTags('Api User') 
export class GrpcController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản user (qua gRPC)' })
  @ApiBody({ type:  RegisterRequest })
  async register(@Body() body: RegisterRequest) {
    console.log('✅ Body nhận được từ Swagger:', body);
    return this.appService.handleRegister(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập tài khoản user (qua gRPC)' })
  @ApiBody({ type:  LoginRequest })
  async login(@Body() body: LoginRequest) {
    console.log('✅ Body nhận được từ Swagger:', body);
    return this.appService.handleLogin(body);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Lấy thông tin user (qua gRPC)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async profile(@Body() body: TokenRequest) {
    return this.appService.handleProfile(body);
  }

  @Post('addVangNapTuWeb')
  @ApiOperation({ summary: 'Thêm vàng cho user (qua gRPC)' })
  async addVang(@Body() body: any) {
    return this.appService.handleAddVang(body);
  }

  @Post('addNgocNapTuWeb')
  @ApiOperation({ summary: 'Thêm ngọc cho user (qua gRPC)' })
  async addNgoc(@Body() body: any) {
    return this.appService.handleAddNgoc(body);
  }

  @Post('addItemWeb')
  @ApiOperation({ summary: 'Thêm item cho user (qua gRPC)' })
  async addItem(@Body() body: any) {
    return this.appService.handleAddItem(body);
  }

  @Post('getItemWeb')
  @ApiOperation({ summary: 'Lấy danh sách item của user (qua gRPC)' })
  async getItem(@Body() body: any) {
    return this.appService.handleGetItems(body);
  }

  @Post('useItemWeb')
  @ApiOperation({ summary: 'Dùng item của user (qua gRPC)' })
  async useItem(@Body() body: any) {
    return this.appService.handleUseItem(body);
  }

  @Post('getTop10BySucManh')
  @ApiOperation({ summary: 'Lấy top 10 user mạnh nhất (qua gRPC)' })
  async topSucManh() {
    return this.appService.handleTop10BySucManh();
  }

  @Post('getTop10ByVang')
  @ApiOperation({ summary: 'Lấy top 10 user nhiều vàng nhất (qua gRPC)' })
  async topVang() {
    return this.appService.handleTop10ByVang();
  }
}