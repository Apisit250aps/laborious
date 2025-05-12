interface TextFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  labelAlt?: string
  className?: string
  error?: string
}

export default function TextField({
  label,
  labelAlt,
  className,
  error,
  ...props
}: TextFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <textarea className={`textarea h-24 ${className}`} {...props}></textarea>
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