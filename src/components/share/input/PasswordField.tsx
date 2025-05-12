'use client'

import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelAlt?: string
  className?: string
  error?: string
}
export default function PasswordField({
  label,
  labelAlt,
  className,
  error,
  ...props
}: InputFieldProps) {
  const [show, setShow] = useState<boolean>(false)
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <div className="join">
        <input
          type={show ? 'text' : 'password'}
          className={`input join-item ${className}`}
          {...props}
        />
        <button type='button' className="btn join-item" onClick={() => setShow(!show)}>
          {show ? <Eye /> : <EyeClosed />}
        </button>
      </div>
      {labelAlt ? (
        <>
          <p className="label">{labelAlt}</p>
        </>
      ) : (
        <></>
      )}
      {error ? (
        <>
          <p className="label text-error">{error}</p>
        </>
      ) : (
        <></>
      )}
    </fieldset>
  )
}
