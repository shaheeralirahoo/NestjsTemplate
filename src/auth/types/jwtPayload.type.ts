import { ROLE } from "src/core/enum/user.enum";

export type JwtPayload = {
  email: string;
  sub: number;
  role: ROLE;
  name: string
};
