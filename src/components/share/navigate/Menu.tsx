'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type MenuLinkProps = {
  href: string
  children: ReactNode
}

export function MenuLink({ href, children }: MenuLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li className='mb-1'>
      <Link href={href} className={isActive ? 'menu-active' : undefined}>
        {children}
      </Link>
    </li>
  )
}