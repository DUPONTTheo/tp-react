import { createContext, useContext, useState } from 'react'
import type { User } from '~/types/auth'
import { useNavigate } from 'react-router'

export const AuthContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
} | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const storedUser = window.localStorage.getItem('user')
    return storedUser ? (JSON.parse(storedUser) as User) : null
  })

  return (
    <AuthContext.Provider
      value={{
        logout: () => {
          setUser(null)
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('user')
          }
          navigate('/login')
        },
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return auth
}
