export class CreateOccurrenceDto {
  user: string;
}

export class CreateOccurrenceFiles {
  frame: CreateOccurrenceFile[];
  print: CreateOccurrenceFile[];
}

export class CreateOccurrenceFile {
  size: number;
  fieldName: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
}
