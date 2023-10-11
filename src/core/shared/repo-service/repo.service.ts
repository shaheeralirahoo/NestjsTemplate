import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Public } from 'src/core/decorators';
import { Cattle } from 'src/core/entities/cattle.entity';
import { Cow } from 'src/core/entities/cow.entity';
import { Order } from 'src/core/entities/order.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class RepoService{
 constructor(
  @InjectRepository(User) public user: Repository<User>,
  @InjectRepository(Cow) public cow: Repository<Cow>,
  @InjectRepository(Cattle) public cattle: Repository<Cattle>,
  @InjectRepository(Order) public order: Repository<Order>,

 ){
 }
}