import { Controller, Post, Body } from '@nestjs/common';
import SmtpService from './report.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import ReportDto from './report.dto';

@ApiTags('report')
@Controller('report')
export class SmtpController {
  constructor(private readonly smtpService: SmtpService) {}

  @ApiResponse({
    status: 200,
    description: 'send report to client',
  })
  @Post('/')
  getReport(@Body() body: ReportDto): string {
    const { text } = body;
    this.smtpService.sendtoClient(text);
    return 'your message sent';
  }
}
