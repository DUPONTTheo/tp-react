import type { Route } from './+types/home'
import { authMiddleware, rolesMiddleware } from '~/middleware/auth'
import { RouterAuthContext } from '~/middleware/auth'
import { UserRole } from '~/types/auth'
import Accounts from '~/accounts/accounts'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Decathlon - TP React' },
    { content: 'Welcome to React Router!', name: 'description' },
  ]
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context }, next) => {
    await authMiddleware({ context })
    await rolesMiddleware({ context, roles: [UserRole.Admin] })
    await next()
  },
]

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  return { user: context.get(RouterAuthContext) }
}

export default function AccountsRoute() {
  return <Accounts />
}
