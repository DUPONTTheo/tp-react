import { createContext, useContext, useState } from 'react'
import { type User, UserRole } from '~/types/auth'

const initialUsers: User[] = [
  { roles: [UserRole.Admin], username: 'admin' },
  { roles: [UserRole.User], username: 'johndoe' },
]

export const UsersContext = createContext<{
  users: User[]
  deleteUser: (username: string) => void
  addUser: (user: User) => void
  updateUser: (username: string, user: User) => void
}>({
  addUser: () => null,
  deleteUser: () => null,
  updateUser: () => null,
  users: initialUsers,
})

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const deleteUser = (username: string) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.username !== username),
    )
  }

  const updateUser = (username: string, updatedUser: User) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.username === username ? updatedUser : user,
      ),
    )
  }

  return (
    <UsersContext.Provider
      value={{
        addUser: (user: User) =>
          setUsers((currentUsers) => [...currentUsers, user]),
        deleteUser,
        updateUser,
        users,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  return useContext(UsersContext)
}
