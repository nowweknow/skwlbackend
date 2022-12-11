import { ApiProperty } from '@nestjs/swagger';

export default class ReportDto {
  @ApiProperty()
  text: string;
}
