import { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorState, Loader } from '@/components'

type Props = {
  children: ReactNode
}

function PublicRoute(props: Props) {
  const { children } = props

  return (
    <ErrorBoundary
      fallback={<ErrorState text="An error occurred in the application." />}
    >
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default PublicRoute
