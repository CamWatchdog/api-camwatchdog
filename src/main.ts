import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
  ValidationError,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['debug'] });
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[] = []) => {
        const error = {
          messages: errors.map((error) => Object.values(error.constraints)).flat(1),
          statusCode: 400,
        };

        return new BadRequestException(error);
      },
    }),
  );
  await app.listen(1880);
}
bootstrap();
