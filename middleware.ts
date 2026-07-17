import { NextRequest, NextResponse } from 'next/server'

const ADMIN_TOKEN = 'admin-session-v1'

function getExpectedToken() {
  return Buffer.from(`65d-admin:${process.env.ADMIN_PASSWORD}`).toString('base64')
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(ADMIN_TOKEN)?.value
    if (token !== getExpectedToken()) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
