import {
  createContext,
  redirect,
  type RouterContextProvider,
} from 'react-router'
import type { User, UserRole } from '~/types/auth'

export const RouterAuthContext = createContext<User | null>(null)

const USER_STORAGE_KEY = 'user'

function isUser(user: unknown): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'username' in user &&
    typeof user.username === 'string'
  )
}

export function getStoredUser(): User | null {
  const serializedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!serializedUser) {
    return null
  }

  try {
    const user: unknown = JSON.parse(serializedUser)

    if (isUser(user)) {
      return user
    }
  } catch {
    // Invalid persisted state is treated as a signed-out user.
  }

  localStorage.removeItem(USER_STORAGE_KEY)
  return null
}

export async function authMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>
}) {
  if (typeof window === 'undefined') {
    return
  }

  const user = getStoredUser()

  if (!user) {
    throw redirect('/login')
  }

  context.set(RouterAuthContext, user)
}

export async function redirectAuthenticatedMiddleware(
  {
    context,
  }: {
    context: Readonly<RouterContextProvider>
  },
  next: () => Promise<unknown>,
) {
  if (typeof window !== 'undefined') {
    const user = getStoredUser()

    if (user) {
      context.set(RouterAuthContext, user)
      throw redirect('/')
    }
  }

  await next()
}

export async function rolesMiddleware({
  context,
  roles,
}: {
  context: Readonly<RouterContextProvider>
  roles: UserRole[]
}) {
  if (typeof window === 'undefined') {
    return
  }

  const user = getStoredUser()
  const userRoles = new Set(user?.roles)

  if (!user || !user.roles || !roles.some((role) => userRoles.has(role))) {
    throw redirect('/')
  }

  context.set(RouterAuthContext, user)
}
