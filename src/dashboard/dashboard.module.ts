import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { OccurrenceModule } from 'src/occurrence/occurrence.module';

@Module({
  imports: [OccurrenceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
