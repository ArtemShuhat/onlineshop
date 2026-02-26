import { Body, Controller, Post } from '@nestjs/common'
import { UserRole } from '__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Roles } from '@/auth/decorators/roles.decorator'

import { TranslateDto } from './dto/translate.dto'
import { TranslationService } from './translation.service'

@Controller('translation')
export class TranslationController {
	constructor(private readonly translationService: TranslationService) {}

	@Post('translate')
	@Authorization()
	@Roles(UserRole.ADMIN)
	async translate(@Body() dto: TranslateDto) {
		const translatedText = await this.translationService.translate(
			dto.text,
			dto.targetLang
		)
		return { translatedText }
	}
}
