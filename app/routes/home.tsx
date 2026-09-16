import type { Route } from './+types/home'
import { authMiddleware } from '~/middleware/auth'
import { RouterAuthContext } from '~/middleware/auth'
import Catalogue from '~/catalogue/catalogue'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Decathlon - Catalogue' },
    { content: 'Browse the product catalogue', name: 'description' },
  ]
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context }, next) => {
    await authMiddleware({ context })
    await next()
  },
]

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  return { user: context.get(RouterAuthContext) }
}

export default function Home() {
  return <Catalogue />
}
