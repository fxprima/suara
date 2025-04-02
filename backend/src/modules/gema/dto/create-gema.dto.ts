import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateGemaDto {

    @IsString()
    @IsNotEmpty({message: "Your gema can not be empty."})
    @Length(1, 300, { message: "Your gema must be 1 to 300 characters." })
    content!: string;

    @IsOptional()
    @IsString()
    parentId?: string;

}
