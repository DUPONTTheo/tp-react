import { Login } from '~/login/login'
import { redirectAuthenticatedMiddleware } from '~/middleware/auth'
import type { Route } from './+types/login'

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  redirectAuthenticatedMiddleware,
]

export default function LoginRoute() {
  return <Login />
}
