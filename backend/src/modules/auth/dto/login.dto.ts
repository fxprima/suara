import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Email harus diisi' })
    @IsEmail({}, { message: 'Email harus valid' })
    email!: string;

    @IsNotEmpty({ message: 'Password harus diisi' })
    password!: string;
}
