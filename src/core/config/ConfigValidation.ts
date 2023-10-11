import { ValidationPipe } from '@nestjs/common';

export const configValidation = new ValidationPipe({
  whitelist: true, // It is Working Only the Properties avalaible in DTO will go through
  stopAtFirstError: true,
  transform: true, // convert into the required data types // ParseIntPipe
 
});
