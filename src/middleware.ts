import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const secret: string = process.env.AUTH_SECRET as string

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const token = await getToken({ req, secret })

  if (pathname === '/auth') {
    if (token) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth?callback=${pathname}`, req.nextUrl)
      )
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
