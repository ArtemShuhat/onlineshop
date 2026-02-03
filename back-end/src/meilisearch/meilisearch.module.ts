import { Module } from '@nestjs/common'

import { MeilisearchController } from './meilisearch.controller'
import { MeilisearchService } from './meilisearch.service'

@Module({
	controllers: [MeilisearchController],
	providers: [MeilisearchService],
	exports: [MeilisearchService]
})
export class MeilisearchModule {}
