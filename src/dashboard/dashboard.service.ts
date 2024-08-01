import { Injectable } from '@nestjs/common';
import { DashboardPeriodDto } from './dto/period.dto';
import { Occurrence } from 'src/occurrence/entities/occurrence.entity';
import { Between, In, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getPeriodBetweenDates, Month } from '../common/date.helper';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Occurrence) private readonly occurrenceRepository: Repository<Occurrence>,
  ) {}

  async getByPeriod(query: DashboardPeriodDto) {
    const computerIdList = query.computerIdList.split(',').filter((id) => id.length > 0);
    const startTime =
      query.startTime && +query.startTime > 0
        ? new Date(+query.startTime).toISOString()
        : new Date(0).toISOString();
    const endTime =
      query.endTime && +query.endTime > 0
        ? new Date(+query.endTime).toISOString()
        : new Date().toISOString();

    const { labels, type } = getPeriodBetweenDates(startTime, endTime);

    const value: number[] = new Array(labels.length).fill(0);

    const [occurrences, total] = await this.occurrenceRepository.findAndCountBy({
      createdAt: Between(startTime, endTime),
      computerId: computerIdList.length > 0 ? In(computerIdList) : Not(IsNull()),
    });

    labels.forEach((label, i) => {
      const count = occurrences.filter((occurrence) => {
        const newDate = new Date(occurrence.createdAt);
        const date = `${newDate.getDate().toString().padStart(2, '0')}/${Month[newDate.getMonth() + 1]}/${newDate.getFullYear()}`;

        return date.includes(label);
      }).length;

      value[i] = count;
    });

    return { labels, value, total, average: total / labels.length, type };
  }
}
