import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Username harus diisi' })
    @IsString({ message: 'Username harus berupa string' })
    username!: string;

    @IsNotEmpty({ message: 'Firstname harus diisi' })
    @IsString({ message: 'Firstname harus berupa string' })
    firstname!: string;

    @IsOptional()
    @IsString({ message: 'Lastname harus berupa string' })
    lastname?: string;

    @IsNotEmpty({ message: 'Email harus diisi' })
    @IsEmail({}, { message: 'Email tidak valid' })
    email!: string;

    @IsNotEmpty({ message: 'Password harus diisi' })
    @IsString({ message: 'Password harus berupa string' })
    password!: string;

    @IsOptional()
    @IsString({ message: 'Biography harus berupa string' })
    biography?: string;

    @IsOptional()
    @IsString({ message: 'Website harus berupa string' })
    website?: string;

    @IsOptional()
    @IsString({ message: 'Location harus berupa string' })
    location?: string;

    @IsOptional()
    @IsString({ message: 'Phone harus berupa string' })
    // @IsPhoneNumber()
    phone?: string;

    @IsNotEmpty({ message: 'Date of birth harus diisi' })
    @IsDateString({}, { message: 'DOB harus berupa format tanggal yang valid (ISO)' })
    dob!: string;
}
