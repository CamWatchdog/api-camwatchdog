import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export const createFile = (path: string, buffer: any) => {
  fs.writeFile(path, buffer, (err) => {
    if (err) {
      Logger.error(err);
      throw err;
    }
  });
};
