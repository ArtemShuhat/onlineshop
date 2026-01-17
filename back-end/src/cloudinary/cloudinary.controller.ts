import { Controller } from '@nestjs/common'

import { CloudinaryService } from './cloudinary.service'

@Controller('cloudinaty')
export class CloudinatyController {
	constructor(private readonly cloudinatyService: CloudinaryService) {}
}
