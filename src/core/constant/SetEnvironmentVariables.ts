import { config } from 'dotenv';
import { parse } from 'dotenv-parse';
import { Environment } from '../interface';

let env: any = config({
  // path: join(process.env.INIT_CWD, '.env.test')
});
if (env.error) throw env.error;
env = parse(env.parsed);
export const ENV: Environment = env; 
