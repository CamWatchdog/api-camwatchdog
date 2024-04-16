import { IsNotEmpty, IsString, Max, Min, ValidateIf } from 'class-validator';

export class ListUserDto {
  @IsString()
  @IsNotEmpty()
  search: string;

  @ValidateIf((ps) => ps >= 0)
  @Max(100)
  @Min(1)
  pageSize: number;

  @ValidateIf((ps) => ps >= 0)
  @Min(1)
  page: number;
}
