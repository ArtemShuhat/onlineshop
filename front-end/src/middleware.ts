import { NextRequest, NextResponse } from 'next/server'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function middleware(request: NextRequest) {
	const { url, cookies } = request
	const session = cookies.get('session')?.value
	const isAuthPage = url.includes('/auth')

	// Если это страница авторизации
	if (isAuthPage) {
		if (session) {
			return NextResponse.redirect(new URL('/dashboard/settings', url))
		}
		return NextResponse.next()
	}

	// Если нет сессии и это не auth страница - редирект на логин
	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', url))
	}

	// Проверка доступа к админ-панели
	if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
		try {
			const response = await fetch(`${SERVER_URL}/users/profile`, {
				// ← Исправил на /users/
				headers: {
					Cookie: `session=${session}`
				}
			})

			if (!response.ok) {
				return NextResponse.redirect(new URL('/auth/login', request.url))
			}

			const user = await response.json()

			// Проверяем роль
			if (user.role !== 'ADMIN') {
				// Не админ - редирект на главную
				return NextResponse.redirect(new URL('/', request.url))
			}
		} catch (error) {
			console.error('Ошибка проверки роли:', error)
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	// Разрешаем доступ
	return NextResponse.next() // ← Добавил обязательный return!
}

export const config = {
	matcher: ['/auth/:path*', '/dashboard/:path*']
}
