import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
  await app.listen(3000);
}
bootstrap();
