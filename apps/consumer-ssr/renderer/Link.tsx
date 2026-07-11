import { usePageContext } from './usePageContext'

export { Link }

function Link(props: { to?: string; className?: string; children: React.ReactNode }) {
  const pageContext = usePageContext()
  const className = [props.className, pageContext.urlPathname === props.to && 'is-active'].filter(Boolean).join(' ')
  return <a {...props} href={props.to} className={className} />
}
