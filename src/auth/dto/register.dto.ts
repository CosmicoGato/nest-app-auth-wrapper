import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(10)
    name: string;

    @IsString()
    @IsEmail()
    email: string;


    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    roles: string[];
}