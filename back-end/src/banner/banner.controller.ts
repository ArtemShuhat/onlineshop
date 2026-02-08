import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Authorization } from 'src/auth/decorators/auth.decorator'

import { UserService } from '@/user/user.service'

import { BannerService } from './banner.service'
import {
	CreateBannerDto,
	ReorderBannerDto,
	UpdateBannerDto
} from './dto/banner.dto'

@Controller('banners')
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	@Get()
	findAll() {
		return this.bannerService.findAll()
	}

	@Authorization(UserRole.ADMIN)
	@Get('admin')
	findAllAdmin() {
		return this.bannerService.findAllAdmin()
	}

	@Authorization(UserRole.ADMIN)
	@Post()
	create(@Body() dto: CreateBannerDto) {
		return this.bannerService.create(dto)
	}

	@Authorization(UserRole.ADMIN)
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
		return this.bannerService.update(id, dto)
	}

	@Authorization(UserRole.ADMIN)
	@Delete(':id')
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.bannerService.delete(id)
	}

	@Authorization(UserRole.ADMIN)
	@Post('reorder')
	reorder(@Body() dto: ReorderBannerDto) {
		return this.bannerService.reorder(dto.bannerIds)
	}
}
