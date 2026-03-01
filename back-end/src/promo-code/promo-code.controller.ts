import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post
} from '@nestjs/common'
import { UserRole } from '@prisma/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { CreatePromoCodeDto } from './dto/create-promo-code.dto'
import { UpdatePromoCodeStatusDto } from './dto/update-promo-code-status.dto'
import { ValidatePromoCodeDto } from './dto/validate-promo-code.dto'
import { PromoCodeService } from './promo-code.service'

@Controller('promo-codes')
export class PromoCodeController {
	constructor(private readonly promoCodeService: PromoCodeService) {}

	@Authorization(UserRole.ADMIN)
	@Post('admin')
	async create(@Body() dto: CreatePromoCodeDto) {
		return this.promoCodeService.create(dto)
	}

	@Authorization(UserRole.ADMIN)
	@Get('admin')
	async getAll() {
		return this.promoCodeService.getAll()
	}

	@Authorization(UserRole.ADMIN)
	@Patch('admin/:id/status')
	async updateStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdatePromoCodeStatusDto
	) {
		return this.promoCodeService.updateStatus(id, dto.isActive)
	}

	@Authorization(UserRole.REGULAR)
	@Post('validate')
	async validate(
		@Authorized('id') userId: string,
		@Body() dto: ValidatePromoCodeDto
	) {
		return this.promoCodeService.validateForCart(userId, dto)
	}
}
