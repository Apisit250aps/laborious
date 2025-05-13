export default function AlertDisplay({ message }: { message: string }) {
  return (
    <div role="alert" className="alert alert-error alert-soft">
      <span>{message}</span>
    </div>
  )
}
