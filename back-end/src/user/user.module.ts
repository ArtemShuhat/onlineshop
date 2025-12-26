import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { PrismaModule } from '../prisma/prisma.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService]
})
export class UserModule {}
