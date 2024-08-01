import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import config from './getter.config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: config().secretJwt,
      signOptions: { expiresIn: config().expiresIn },
    };
  },
};
