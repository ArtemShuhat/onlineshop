import { Module } from '@nestjs/common'

import { MeilisearchModule } from '@/meilisearch/meilisearch.module'
import { PrismaModule } from '@/prisma/prisma.module'

import { SearchController } from './search.controller'
import { SearchService } from './search.service'

@Module({
	imports: [PrismaModule, MeilisearchModule],
	controllers: [SearchController],
	providers: [SearchService],
	exports: [SearchService]
})
export class SearchModule {}
