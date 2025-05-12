interface CardContentProps {
  title?: string
  actions?: React.ReactNode
  children?: React.ReactNode
}
export default function CardContent(props: CardContentProps) {
  const { title, actions, children } = props
  return (
    <>
      <div className="card">
        <div className="card-body h-full relative">
          <div className="card-title flex justify-between items-center">
            <h2>{title}</h2>
            <div className="card-actions">{actions}</div>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
