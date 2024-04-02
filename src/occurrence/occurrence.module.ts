import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceController } from './occurrence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence])],
  controllers: [OccurrenceController],
  providers: [OccurrenceService],
  exports: [TypeOrmModule],
})
export class OccurrenceModule {}
