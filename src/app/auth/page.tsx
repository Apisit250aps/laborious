'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const handleLogin = async () => {
    const result = await signIn('google', { redirect: false })
    if (!result.error) {
      router.push('/')
    } else {
      alert(result.error)
    }
  }
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button
            className="btn btn-outline btn-neutral min-w-96"
            onClick={handleLogin}
          >
            <i className="ri-google-fill"></i>
            Google
          </button>
        </div>
      </div>
    </div>
  )
}
