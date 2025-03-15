import { IsDate, IsEmail, IsPhoneNumber, IsStrongPassword } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email!: string
    
    @IsStrongPassword()
    password!: string

    @IsPhoneNumber()
    phone!: string

    username!: string
    firstname!: string
    lastname!: string

    @IsDate()
    dob!: Date

}
