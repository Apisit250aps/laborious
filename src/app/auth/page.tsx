'use client'

import { Toast } from '@/libs/callback'
import { signIn, SignInResponse } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const result = await signIn('google', { redirect: true }) as unknown as SignInResponse
      
      if (!result?.error) {
        Toast('Login success', 'success')
        router.push('/') // เปลี่ยน path ตามหน้าที่ต้องการนำทางไป
      } else {
        Toast('Login failed', 'error')
        console.error('Sign-in failed:', result)
      }
    } catch (error) {
      Toast('An error occurred during login', 'error')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-5xl font-bold">Welcome</h1>
          <p className="py-2">
            Sign in with your Google account to continue your journey.
          </p>
          <button
            className="btn btn-outline btn-neutral w-full flex items-center justify-center gap-2"
            onClick={handleLogin}
          >
            <i className="ri-google-fill text-xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}
