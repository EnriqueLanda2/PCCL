import { IsArray, IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  roleIds!: string[];
}
