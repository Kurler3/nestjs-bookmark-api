import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class EditBookmarkDto  {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;  

    @IsNotEmpty()
    @IsUrl()
    @IsOptional()
    link?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;
}