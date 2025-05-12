interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelAlt?: string
  className?: string
  error?: string
}

export default function InputField({
  label,
  labelAlt,
  className,
  error,
  ...props
}: InputFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <input type="text" className={`input ${className}`} {...props} />
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
