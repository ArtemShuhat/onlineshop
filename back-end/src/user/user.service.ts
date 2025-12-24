import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from '@node-rs/argon2'
import { PrismaService } from 'src/prisma/prisma.service'

import { AuthMethod, Prisma } from '../../__generated__'

import { UpdateUserDto } from './dto/update-user.dto'
import { returnUserObject } from './objects/return-user.object'

@Injectable()
export class UserService {
	prisma: any
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные.'
			)
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})
		return user
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				method,
				isVerified
			},
			include: {
				accounts: true
			}
		})
		return user
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		const updatedUser = this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				displayName: dto.name,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})
		return updatedUser
	}

	public async byId(id: string, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			select: {
				...returnUserObject,
				...selectObject
			}
		})

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные.'
			)
		}

		return user
	}
}
