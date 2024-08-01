import { Controller, Get, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { DashboardPeriodDto } from './dto/period.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('period')
  getByPeriod(@Query() query: DashboardPeriodDto) {
    return this.dashboardService.getByPeriod(query);
  }
}
