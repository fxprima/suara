import { Match } from "src/decorators/match.decorator";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";


export class RegisterUserDto extends CreateUserDto {
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword!: string;
}
