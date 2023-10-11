import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepoService } from '../shared/repo-service/repo.service';

@Injectable()
export class NestService {
  @InjectRepository(RepoService) public repos: RepoService;
}
