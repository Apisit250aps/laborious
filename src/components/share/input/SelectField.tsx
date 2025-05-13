import React from 'react'

export interface SelectOption {
  label: string
  value: string | number
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  labelAlt?: string
  className?: string
  error?: string
  options: SelectOption[]
}

export default function SelectField({
  label,
  labelAlt,
  className,
  error,
  options,
  ...props
}: SelectFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <select className={`select ${className}`} {...props}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {labelAlt && <p className="label">{labelAlt}</p>}
      {error && <p className="label text-error">{error}</p>}
    </fieldset>
  )
}
