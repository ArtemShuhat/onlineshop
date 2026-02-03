import { Controller, Get, Query } from '@nestjs/common'

import { SearchQueryDto } from './dto/search-query.dto'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	async search(@Query() dto: SearchQueryDto) {
		return this.searchService.search(dto.q, {
			categoryId: dto.categoryId,
			minPrice: dto.minPrice,
			maxPrice: dto.maxPrice,
			sortBy: dto.sortBy,
			limit: dto.limit
		})
	}

	@Get('reindex')
	async reindex() {
		await this.searchService.syncAllProducts()
		return { message: 'Reindex started' }
	}
}
