import { BadRequestException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { ROLE } from '../enum/user.enum';
import { ResponseData } from '../Common/ResponseModel';
import { RESPOSE_CODE_message } from '../enum/respose-code-status';

export const searalizeUser = (d: any, role: ROLE) => {
  const user: User = {
    email: d.email,
    name: d.name,
    role,
    password: '',
  };
  return user;
};
const res = new ResponseData();
export const throwForbiddenException = (data) => {
  res.message = [RESPOSE_CODE_message.EMAILALREADYEXISIT];
  res.statusCode = HttpStatus.BAD_REQUEST;
  if (data) throw new BadRequestException(res);
};

export const throwForbiddenExceptionCowExist = (data) => {
  res.message = [RESPOSE_CODE_message.COWALREADYEXISIT];
  res.statusCode = HttpStatus.BAD_REQUEST;
  if (data) throw new BadRequestException(res);
};

export const throwForbiddenExceptionUser = (data) => {
  res.statusCode = HttpStatus.BAD_REQUEST;
  res.message = [RESPOSE_CODE_message.USERDOESNOTEXIST];
  if (!data) throw new BadRequestException(res);
};

export const throwForbiddenExceptionCattle = (data) => {
  res.statusCode = HttpStatus.BAD_REQUEST;
  res.message = [RESPOSE_CODE_message.CATTLEDOESNOTEXIST];
  if (!data) throw new BadRequestException(res);
};

export const throwForbiddenExceptionFileRequried = (data) => {
  res.statusCode =  HttpStatus.BAD_REQUEST;
  res.message= [RESPOSE_CODE_message.FILEREQURIED];
  if (!data) throw new BadRequestException(res); 
};

export const throwForbiddenExceptionCow = (data) => {
  res.statusCode = HttpStatus.BAD_REQUEST;
  res.message = [RESPOSE_CODE_message.COWDOESNOTEXIST];
  if (!data) throw new BadRequestException(res);
};

export const throwForbiddenExceptionName = (data) => {
  if (data) throw new ForbiddenException('Name already exsit! Change Name');
};

export const generatePassword = () => {
  let result = '';
  const characters =
    '!@#~%^&*()_+}{":ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
