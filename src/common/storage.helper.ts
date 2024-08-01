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

export const getFile = (path: string) => {
  return fs.readFileSync(path);
};
