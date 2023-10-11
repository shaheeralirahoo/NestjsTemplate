import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { argon, ENV, throwForbiddenException, throwForbiddenExceptionCattle, throwForbiddenExceptionCow, throwForbiddenExceptionCowExist, throwForbiddenExceptionUser } from 'src/core/constant';
import { User } from 'src/core/entities/user.entity';
import { BaseService } from 'src/core/service';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserReqFieldDto } from './dto/user-req-field.dto';
import { JwtPayload, Tokens } from './types';
import { ROLE } from 'src/core/enum/user.enum';
import { ResponseData } from 'src/core/Common/ResponseModel';
import { RESPOSE_CODE_message } from 'src/core/enum/respose-code-status';
import { CreateCowDto } from './dto/create-cow.dto';
import { Cow } from 'src/core/entities/cow.entity';
import { CreateOrderDto } from './dto/create-order.dto copy';
import { Order } from 'src/core/entities/order.entity';

@Injectable()
export class AuthService extends BaseService {

  constructor(
    private _jwt: JwtService,
  ) {
    super()
  }
  public repo: Repository<any>;

  async signUpAdmin(data: UserReqFieldDto) {
    this.logger.warn('Sign Up Admin is triggered!');
    const hashResult = await argon.hash(data.password);

    const existUser = await this.repos.user.findOneBy({ email: data.email });
    throwForbiddenException(existUser);

    const user = this.repos.user.create({ ...data, password: hashResult });
    await this.repos.user.save(user)
    const res = new ResponseData();

    const datas = await this.returnGeneratedToken(user);
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ADMIN];
    res.data = datas
    return res;

  }

  async CustomerSignUp(data: UserReqFieldDto) {
    const hashResult = await argon.hash(data.password);

    const existUser = await this.repos.user.findOneBy({ email: data.email });
    throwForbiddenException(existUser);

    const user = this.repos.user.create({ ...data, password: hashResult });
    await this.repos.user.save(user)
    const res = new ResponseData();

    const datas = await this.returnGeneratedToken(user);
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.User];
    res.data = datas
    return res;
  }

  async returnGeneratedToken(user: User) {
    const tokens = await this.getTokens(user as any);
    await this.updateRtHash(user.id, tokens.refresh_token);
    tokens.user = this.returnedSearializedUser(user);
    return tokens;
  }
  async getTokens({ id, email, role, name }): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: id,
      email,
      role,
      name
    };

    const [at, rt] = await Promise.all([
      this._jwt.signAsync(jwtPayload, {
        secret: ENV.JWT_AT_SECRET,
        expiresIn: ENV.JWT_ACCESS_TOKEN_EXPIRE,
      }),
      this._jwt.signAsync(jwtPayload, {
        // secret: this._config.get<string>(ENV.JWT_RT_SECRET),
        secret: ENV.JWT_RT_SECRET,
        expiresIn: ENV.JWT_REFRESH_TOKEN_EXPIRE,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(id: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.repos.user.update(id, { hashedRt: hash });
  }
  returnedSearializedUser({
    id,
    name,
    email,
    role
  }: User) {
    return { id, name, email, role };
  }

  async signinLocal(dto: SignInDto) {
    const res = new ResponseData();
    const user = await this.repos.user.findOneBy({ email: dto.email });
    throwForbiddenExceptionUser(user);
    if (user.role != ROLE.ADMIN) {
      res.message = [RESPOSE_CODE_message.EMAILALREADYEXISIT];
      res.statusCode = HttpStatus.BAD_REQUEST;
      return res;
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      res.statusCode = HttpStatus.UNAUTHORIZED
      res.message = [RESPOSE_CODE_message.INVALID];
      return res;
    }

    const datas = await this.returnGeneratedToken(user);
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.SUCCESSFULL];
    res.data = datas
    return res;

  }

  async signinUser(dto: SignInDto) {
    const res = new ResponseData();
    const user = await this.repos.user.findOneBy({ email: dto.email });
    throwForbiddenExceptionUser(user);
    if (user.role != ROLE.CUSTOMER) {
      res.message = [RESPOSE_CODE_message.EMAILALREADYEXISIT];
      res.statusCode = HttpStatus.BAD_REQUEST;
      return res;
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      res.statusCode = HttpStatus.UNAUTHORIZED
      res.message = [RESPOSE_CODE_message.INVALID];
      return res;
    }

    const datas = await this.returnGeneratedToken(user);
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.SUCCESSFULL];
    res.data = datas
    return res;

  }

  async logout(id: number): Promise<boolean> {
    if (!id) return false;
    const result = await this.repos.user.findOneBy({ id });
    if (result && result.hashedRt != null) {
      this.repos.user.update(id, { hashedRt: null });
    }
    return true;
  }

  async forgetPasswordForEmail(email: any) {
    const user = await this.repos.user.findOneBy(email);
    if (!user) throw new ForbiddenException('Email is incorrect');
    const otpcode = Math.floor(1000 + Math.random() * 9000);
    // const uuidToken: string = uuid();
    await this.repos.user.update(user.id, { forgetPasswordToken: otpcode })

    return { message: "Forget Password Email Sent on " + user.email }
  }

  async forgetPasswordUpdate({ forgetPasswordToken, password }) {
    const user = await this.repos.user.findOneBy({ forgetPasswordToken });
    if (!user) throw new ForbiddenException('Invalid Forget Password OTP');
    await this.repos.user.update(user.id, { forgetPasswordToken: null, password: await argon.hash(password) })
    return { message: "Now you can login with your new updated password" }
  }

  async changePassword(id, body: ChangePasswordDto) {
    const user = await this.repos.user.findOneBy(id);
    if (!user) throw new ForbiddenException('User Not Found');
    const passwordMatches = await argon.verify(user.password, body.oldPassword);
    if (!passwordMatches) throw new ForbiddenException('OldPassword Not Match');
    await this.repos.user.update(id, { password: await argon.hash(body.newPassword), forgetPasswordToken: null })
    return { message: "Password Updated Successfully" }
  }


  async create(body: CreateFormDto) {
    const cattle = await this.repos.cattle.findOneBy({ title: body.title });
    throwForbiddenException(cattle);

    const form = this.repos.cattle.create(body)
    await this.repos.cattle.save(form)
    const res = new ResponseData();
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ACCEPT];
    return res;
  }

  async createcow(data: CreateCowDto) {
    const cattle = await this.repos.cattle.findOneBy({ id: data.cattleId });
    throwForbiddenExceptionCattle(cattle);

    const d: Cow = {
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image,
      cattleId: data.cattleId,
    };

    const cowForm = this.repos.cow.create(d)
    await this.repos.cow.save(cowForm)
    const res = new ResponseData();
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ACCEPT];
    return res;
  }

  async createOrder(data: CreateOrderDto, userId: number) {

    const cowExist = await this.repos.order.findOneBy({ cowId: data.cowId });
    throwForbiddenExceptionCowExist(cowExist);

   const cattle = await this.repos.cattle.findOneBy({ id: data.cattleId });
    throwForbiddenExceptionCattle(cattle);

    const cow = await this.repos.cattle.findOneBy({ id: data.cattleId });
    throwForbiddenExceptionCow(cow);

    const d: Order = {
      name: data.name,
      address: data.address,
      postalCode: data.postalCode,
      mobile: data.mobile,
      cashOnDelivery: data.cashOnDelivery,
      cowId: data.cowId,
      cattleId: data.cattleId,
      userId: userId,
    };

    const orderForm = this.repos.order.create(d)
    const ordercreate =await this.repos.order.save(orderForm)
    await this.repos.order.update(ordercreate.id,{orderNumber:ordercreate.id})
    const res = new ResponseData();
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ACCEPT];
    return res;
  }

  async findAllCattle() {
    const res = new ResponseData();
    const cattle = await this.repos.cattle.find();
    if (!cattle) {
      res.statusCode = HttpStatus.NOT_FOUND
      res.message = [RESPOSE_CODE_message.NOTFOUND];
      return res;
    }
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ACCEPT];
    res.data = cattle
    return res;
  }

  async findAllCow(id:number) {
    const res = new ResponseData();
    const cattle = await this.repos.cow.findBy({cattleId:id});
    if (!cattle) {
      res.statusCode = HttpStatus.NOT_FOUND
      res.message = [RESPOSE_CODE_message.NOTFOUND];
      return res;
    }
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ACCEPT];
    res.data = cattle
    return res;
  }

  async findAllOrder() {
    const res = new ResponseData();
    const cattle = await this.repos.order.find(({
      select: { user: { email: true, }, cattleCow: { title: true,image:true }, cowOrder: { title: true,price:true } },
      relations: { user: true, cattleCow: true, cowOrder: true }
    }));
    if (!cattle) {
      res.statusCode = HttpStatus.NOT_FOUND
      res.message = [RESPOSE_CODE_message.NOTFOUND];
      return res;
    }
    res.statusCode = HttpStatus.OK;
    res.message = [RESPOSE_CODE_message.ACCEPT];
    res.data = cattle
    return res;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  removeVoter(id: number) {
    return `This action removes a #${id} auth`;
  }
}
