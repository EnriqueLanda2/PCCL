import { Controller, Get, Param, Post } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
	constructor(private readonly certService: CertificatesService) {}

	@Post(':inscriptionId')
	generate(
		@Param('inscriptionId') inscriptionId: string,
	) {
		return this.certService.generate(inscriptionId, 'system');
	}

	@Get()
	findAll() {
		return this.certService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.certService.findOne(id);
	}

	@Get(':id/download')
	downloadPdf(@Param('id') id: string) {
		return this.certService.downloadPdf(id);
	}
}


