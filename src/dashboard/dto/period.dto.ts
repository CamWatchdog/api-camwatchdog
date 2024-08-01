import { IsNumber, IsString, ValidateIf } from 'class-validator';

export class DashboardPeriodDto {
  @IsNumber()
  @ValidateIf((ps) => ps >= 0)
  startTime: number;

  @IsNumber()
  @ValidateIf((ps) => ps >= 0)
  endTime: number;

  @IsString()
  computerIdList: string;
}
