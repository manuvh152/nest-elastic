import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {

  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @MinLength(1)
  description?: string;

  @IsString()
  link: string;

  @IsString()
  @MinLength(2)
  store: string;

  @IsString()
  @MinLength(2)
  category: string;

  @IsString()
  @IsOptional()
  slug?: string;

}
