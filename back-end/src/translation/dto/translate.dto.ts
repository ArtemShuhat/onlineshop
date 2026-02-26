import { IsIn, IsString, MinLength } from 'class-validator'

export class TranslateDto {
	@IsString()
	@MinLength(1)
	text: string

	@IsIn(['EN', 'UK'])
	targetLang: 'EN' | 'UK'
}
