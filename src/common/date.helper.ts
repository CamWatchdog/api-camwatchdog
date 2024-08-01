export const getPeriodBetweenDates = (start: string, end: string) => {
  const labels: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  const daysBetween = diferenceInDays(startDate, endDate);
  let multiplier = 1;
  let type = 'day';

  if (daysBetween > 360) {
    type = 'year';
    multiplier = 360;
  } else if (daysBetween > 30) {
    type = 'month';
    multiplier = 30;
  }

  for (let i = 0; i < daysBetween / multiplier; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * multiplier);
    const day = date.getDate().toString().padStart(2, '0');
    const month = Month[date.getMonth() + 1];
    const year = date.getFullYear();

    labels.push(
      (daysBetween <= 30 ? day + '/' : '') + (daysBetween < 360 ? month + '/' : '') + year,
    );
  }

  return { labels, type };
};

export const diferenceInDays = (start: Date, end: Date) => {
  const diffTime = Math.abs(start.getTime() - end.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export enum Month {
  Janeiro = 1,

  Fevereiro = 2,

  Março = 3,

  Abril = 4,

  Maio = 5,

  Junho = 6,

  Julho = 7,

  Agosto = 8,

  Setembro = 9,

  Outubro = 10,

  Novembro = 11,

  Dezembro = 12,
}
