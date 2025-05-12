import { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  isLoading?: boolean
  children?: ReactNode
}

export default function Button({
  className,
  children,
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button className={`btn ${className}`} {...props}>
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
