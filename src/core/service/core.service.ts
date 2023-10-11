import { Inject, Logger } from '@nestjs/common';
import { RepoService } from '../shared/repo-service/repo.service';

export class CoreService {
  // @Inject Doesn't Work 
  @Inject(RepoService) public repos: RepoService;
  logger: Logger
  constructor(){
    this.logger = new Logger();
  }

}
