import { cookies } from 'next/headers'
import 'server-only'

export async function getServerCookieHeader() {
	const cookieStore = await cookies()
	const cookie = cookieStore.toString()

	return cookie ? { cookie } : {}
}
