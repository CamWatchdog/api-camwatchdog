import { IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';

export class ListComputerDto {
  @ValidateIf((ps) => ps >= 0)
  @Max(100)
  @Min(1)
  pageSize: number;

  @ValidateIf((ps) => ps >= 0)
  @Min(1)
  page: number;

  @ValidateIf((ps) => ps >= 0)
  @IsOptional()
  @IsNumber()
  @IsOptional()
  startTime: number;

  @ValidateIf((ps) => ps >= 0)
  @IsOptional()
  @IsNumber()
  endTime: number;

  @IsString()
  description: string;
}
