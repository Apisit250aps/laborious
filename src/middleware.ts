import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const secret: string = process.env.AUTH_SECRET as string

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret })
  console.log(token)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
