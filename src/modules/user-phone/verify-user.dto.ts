import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserPhone {
  @ApiProperty()
  code: number;

  @ApiProperty()
  id: number;
}

export class LoginUserWithPhone {
  @ApiProperty()
  phone: string;
}
