import { IsEnum, IsOptional, IsPositive, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { OrderBy } from "../enums/order-by.enum";

export class SearchQueryDto{

  @IsOptional()
  query?: string;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(50)
  @Type( () => Number )
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type( () => Number )
  offset?: number;

  @IsOptional()
  @Min(0)
  @Type( () => Number )
  min?: number;

  @IsOptional()
  @Min(1)
  @Type( () => Number )
  max?: number;

  @IsOptional()
  @IsEnum(OrderBy)
  order?: OrderBy;

}