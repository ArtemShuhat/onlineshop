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
import { Authorization } from 'src/auth/decorators/auth.decorator'

import { BannerService } from './banner.service'
import {
	CreateBannerDto,
	ReorderBannerDto,
	UpdateBannerDto
} from './dto/banner.dto'

@Controller('banner')
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	@Get()
	findAll() {
		return this.bannerService.findAll()
	}

	@Authorization('ADMIN')
	@Get('admin')
	findAllAdmin() {
		return this.bannerService.findAllAdmin()
	}

	@Authorization('ADMIN')
	@Post()
	create(@Body() dto: CreateBannerDto) {
		return this.bannerService.create(dto)
	}

	@Authorization('ADMIN')
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
		return this.bannerService.update(id, dto)
	}

	@Authorization('ADMIN')
	@Delete(':id')
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.bannerService.delete(id)
	}

	@Authorization('ADMIN')
	@Post('reorder')
	reorder(@Body() dto: ReorderBannerDto) {
		return this.bannerService.reorder(dto.bannerIds)
	}
}
