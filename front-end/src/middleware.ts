import { routing } from '@shared/i18n'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		/\.(.*)$/.test(pathname)
	) {
		return NextResponse.next()
	}

	const intlResponse = intlMiddleware(request)
	if (intlResponse) return intlResponse
	
	const { url, cookies } = request
	const session = cookies.get('session')?.value
	const isAuthPage = pathname.includes('/auth')

	if (isAuthPage) {
		if (session) return NextResponse.redirect(new URL('/', url))
		return NextResponse.next()
	}

	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', url))
	}

	if (pathname.startsWith('/dashboard/admin')) {
		try {
			const response = await fetch(`${SERVER_URL}/users/profile`, {
				headers: { Cookie: `session=${session}` }
			})
			if (!response.ok)
				return NextResponse.redirect(new URL('/auth/login', request.url))
			const user = await response.json()
			if (user.role !== 'ADMIN')
				return NextResponse.redirect(new URL('/', request.url))
		} catch {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next|.*\\..*).*)']
}
