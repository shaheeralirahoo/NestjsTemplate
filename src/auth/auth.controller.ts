import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, Public, Roles } from 'src/core/decorators';
import { ROLE, UPLOAD_PATH } from 'src/core/enum/user.enum';
import { HandleUniqueError } from 'src/core/error/HandleUniqueError';
import { AuthService } from './auth.service';
import { ChangeForgetPasswordDto } from './dto/change-forget-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { EmailDto } from './dto/email.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserReqFieldDto } from './dto/user-req-field.dto';
import { Tokens } from './types';
import { CreateCowDto } from './dto/create-cow.dto';
import { CreateOrderDto } from './dto/create-order.dto copy';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileImageTypeInterceptor } from 'src/core/interceptor';
import { diskStorage } from 'multer';
import { FileName, FolderName } from 'src/core/constant/getFileName';
import { ResponseData } from 'src/core/Common/ResponseModel';
import { RESPOSE_CODE_message } from 'src/core/enum/respose-code-status';
import { FlieLocation } from './dto/filelocations';
import { OpenApiResponse } from 'src/core/Common/testing';
import { throwForbiddenExceptionFileRequried } from 'src/core/constant';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('admin/signUp')
  signUpAdmin(
    @Body() body: UserReqFieldDto,
  ) {
    body.role = ROLE.ADMIN;
    try {
      return this.authService.signUpAdmin(body);
    } catch (e) {
      HandleUniqueError(e);
    }
  }

  @Public()
  @Post('customer/signUp')
  CustomerSignUp(
    @Body() body: UserReqFieldDto,
  ) {
    body.role = ROLE.CUSTOMER;
    try {
      return this.authService.CustomerSignUp(body);
    } catch (e) {
      HandleUniqueError(e);
    }
  }

  @Public()
  @Post('admin/logIn')
  signinLocal(@Body() body: SignInDto) {
    return this.authService.signinLocal(body);
  }

  @Public()
  @Post('user/logIn')
  signinUser(@Body() body: SignInDto) {
    return this.authService.signinUser(body);
  }

  @Public()
  @Post('logout')
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  // @Public()
  // @Post('forget-password-for-email')
  // forgetPasswordForEmail(@Body() body: EmailDto) {
  //   return this.authService.forgetPasswordForEmail(body);
  // }

  // @Public()
  // @Post('forget-change-password')
  // forgetChangePassword(@Body() body: ChangeForgetPasswordDto) {
  //   if(body.password != body.confirmPassword) 
  //     throw new HttpException('password confirmPassword not matched', HttpStatus.BAD_REQUEST)
  //   return this.authService.forgetPasswordUpdate(body);
  // }

  // @Roles(ROLE.ADMIN)
  // @Patch('change-password')
  // changePassword(
  //   @GetCurrentUserId() id: string,
  //   @Body() body: ChangePasswordDto
  //   ) {
  //   if( body.newPassword != body.confirmNewPassword ) 
  //     throw new HttpException('password confirmPassword not matched', HttpStatus.BAD_REQUEST)
  //   return this.authService.changePassword(id,body);
  // }

  @Post('cattle')
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  create(@Body() Body: CreateFormDto) {
    try{
      return this.authService.create(Body);
    }
    catch(e){
      HandleUniqueError(e)
    }
  }

  @Post('cow')
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  createcow(@Body() Body: CreateCowDto) {
    try{
      return this.authService.createcow(Body);
    }
    catch(e){
      HandleUniqueError(e)
    }
  }

  @Post('order')
  @Roles(ROLE.CUSTOMER)
  @ApiBearerAuth()
  createOrder(@Body() Body: CreateOrderDto,@GetCurrentUserId() userId: number,) {
    try{
      return this.authService.createOrder(Body,userId);
    }
    catch(e){
      HandleUniqueError(e)
    }
  }

  @Get('all/cattle')
  @Roles(ROLE.ADMIN,ROLE.CUSTOMER)
  @ApiBearerAuth()
  findAllCattle() {
    try{
      return this.authService.findAllCattle();
    }
    catch(e){
      HandleUniqueError(e)
    }
  }

  @Get('all/cow/:id')
  @Roles(ROLE.ADMIN,ROLE.CUSTOMER)
  @ApiBearerAuth()
  findAllCow(@Param('id') id: number) {
    try{
      return this.authService.findAllCow(id);
    }
    catch(e){
      HandleUniqueError(e)
    }
  }

  @Get('all/order')
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  findAllOrder() {
    try{
      return this.authService.findAllOrder();
    }
    catch(e){
      HandleUniqueError(e)
    }
  }

  @Public()
  @Post('upload/:path')
  @OpenApiResponse(FlieLocation)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: FolderName,
      filename: FileName
    }),
    fileFilter: FileImageTypeInterceptor,
    limits: {
      fileSize: 1024 * 5120,
      files: 1,
    },
  }))
  async uploadFile(@Param('path') path: UPLOAD_PATH,
    @UploadedFile() file: Express.Multer.File) {

    if (!file?.filename)
      throwForbiddenExceptionFileRequried(file?.filename);
    const resp = new FlieLocation()
    const res = new ResponseData();
    // file.destination='./public/gift'
    const fileaddress = `public/${path}/${file.filename}`;
    resp.location = fileaddress
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.FILEUPLOADED];
    res.data = resp
    return res
  }
}
