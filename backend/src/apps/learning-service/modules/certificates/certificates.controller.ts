import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

class IssueDto {
  courseId!: string;
  studentId!: string;
}

@Controller('certificates')
@UseGuards(PermissionsGuard)
export class CertificatesController {
  constructor(private readonly svc: CertificatesService) {}

  @Post()
  @RequirePermission('certificates:issue')
  issue(@Body() body: IssueDto) {
    return this.svc.issue(body.courseId, body.studentId, 'system');
  }

  @Get(':id')
  @RequirePermission('certificates:read')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
