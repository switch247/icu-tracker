import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value

  if (!user && (
    request.nextUrl.pathname.startsWith('/my-hospital') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/users') ||
    request.nextUrl.pathname.startsWith('/hospitals')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (user) {
    const userData = JSON.parse(user)
    if (request.nextUrl.pathname === '/users' && userData.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // && userData.role !== 'HOSPITAL_ADMIN'
    if (request.nextUrl.pathname.startsWith('/my-hospital') && userData.role == 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/my-hospital/:path*', '/profile', '/users', '/hospitals'],
}

