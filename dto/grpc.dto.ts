import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class Empty {}

export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public role: string,
    public biBan: boolean,
    public vang: number,
    public ngoc: number,
    public sucManh: number,
    public vangNapTuWeb: number,
    public ngocNapTuWeb: number,
    public x: number,
    public y: number,
    public mapHienTai: string,
    public daVaoTaiKhoanLanDau: boolean,
    public coDeTu: boolean,
    public danhSachVatPhamWeb: number[],
  ) {}
}

export class RegisterRequest {
  @ApiProperty({ example: 'dang123', description: 'Tên đăng nhập' }) // của swagger
  @IsString() // của validate
  @IsNotEmpty({ message: 'Username không được để trống' }) // của validate
  username: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu đăng nhập' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}

export class RegisterResponse {
  constructor(public success: boolean) {}
}

export class LoginRequest {
  @ApiProperty({ example: 'dang123', description: 'Tên đăng nhập' }) // của swagger
  @IsString() // của validate
  @IsNotEmpty({ message: 'Username không được để trống' }) // của validate
  username: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu đăng nhập' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}

export class LoginResponse {
  constructor(public access_token: string) {}
}

export class TokenRequest {
  @ApiProperty({ example: 'token', description: 'Token get data' })
  @IsString()
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string
}

export class GetUserRequest {
  constructor(public username: string) {}
}

export class UserResponse {
  constructor(public user?: User) {}
}

export class SaveGameRequest {
  constructor(
    public user?: User,
    public sucManhDeTu?: number,
  ) {}
}

export class SaveGameResponse {
  constructor(public message: string) {}
}

export class UsernameRequest {
  constructor(public username: string) {}
}

export class BalanceResponse {
  constructor(
    public vangNapTuWeb: number,
    public ngocNapTuWeb: number,
  ) {}
}

export class UseBalanceRequest {
  constructor(
    public username: string,
    public amount: number,
  ) {}
}

export class UpdateBalanceRequest {
  constructor(
    public username: string,
    public type: string,
    public amount: number,
  ) {}
}

export class AddBalanceRequest {
  constructor(
    public username: string,
    public amount: number,
  ) {}
}

export class UserListResponse {
  constructor(public users: User[]) {}
}

export class AddItemRequest {
  constructor(
    public username: string,
    public itemId: number,
  ) {}
}

export class ItemListResponse {
  constructor(public itemIds: number[]) {}
}

export class UseItemRequest {
  constructor(
    public username: string,
    public itemId: number,
  ) {}
}

export class BanUserRequest {
  constructor(
    public username: string,
    public adminName: string,
  ) {}
}

export class UpdateRoleRequest {
  constructor(
    public username: string,
    public newRole: string,
    public adminName: string,
  ) {}
}

export class MessageResponse {
  constructor(public message: string) {}
}
