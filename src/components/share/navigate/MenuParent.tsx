import { ReactNode } from 'react'

export default function MenuParent({
  children,
  title
}: {
  children?: ReactNode
  title: string
}) {
  return (
    <li>
      <h2 className="menu-title">{title}</h2>
      <ul>{children}</ul>
    </li>
  )
}
