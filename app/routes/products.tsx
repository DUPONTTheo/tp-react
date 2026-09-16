import type { Route } from './+types/home'
import { authMiddleware, rolesMiddleware } from '~/middleware/auth'
import { RouterAuthContext } from '~/middleware/auth'
import Products from '~/products/products'
import { UserRole } from '~/types/auth'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Decathlon - Products' },
    { content: 'Manage products', name: 'description' },
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

export default function ProductsRoute() {
  return <Products />
}
