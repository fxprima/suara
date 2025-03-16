import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Email harus diisi' })
    email!: string;

    @IsNotEmpty({ message: 'Password harus diisi' })
    password!: string;
}
