import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import client from './client'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [Google],
  session: { strategy: 'jwt', maxAge: 1000 * 60 * 60 * 24 * 30 }
})
