import { NextRequest, NextResponse } from 'next/server'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function middleware(request: NextRequest) {
	const { url, cookies } = request
	const session = cookies.get('session')?.value
	const isAuthPage = url.includes('/auth')

	if (isAuthPage) {
		if (session) {
			return NextResponse.redirect(new URL('/', url))
		}
		return NextResponse.next()
	}

	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', url))
	}

	if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
		try {
			const response = await fetch(`${SERVER_URL}/users/profile`, {
				headers: {
					Cookie: `session=${session}`
				}
			})

			if (!response.ok) {
				return NextResponse.redirect(new URL('/auth/login', request.url))
			}

			const user = await response.json()

			if (user.role !== 'ADMIN') {
				return NextResponse.redirect(new URL('/', request.url))
			}
		} catch (error) {
			console.error('Ошибка проверки роли:', error)
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/auth/:path*', '/dashboard/:path*']
}
