import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from '../constant';
import { entities } from '../entities/entities';
import { RepoService } from './repo-service/repo.service';
import { ConfigService } from '@nestjs/config';

 
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
  ],

  providers: [RepoService],
  exports: [RepoService, TypeOrmModule],
})
export class SharedModule {} 
