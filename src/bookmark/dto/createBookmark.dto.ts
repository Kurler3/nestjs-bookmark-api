import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";


export class CreateBookmarkDto {

    @IsString()
    @IsNotEmpty()
    title: string;  

    @IsNotEmpty()
    @IsUrl()
    link: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;
}