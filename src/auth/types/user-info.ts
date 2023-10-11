import { ROLE } from 'src/core/enum/user.enum';

export type UserInfo = {
  id: number;
  name: string;
  email: string;
  role: ROLE;
  mobile: string;
  image: string;
};
