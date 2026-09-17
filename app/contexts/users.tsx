import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type User, UserRole } from '~/types/auth'

const usersUrl = 'https://fakestoreapi.com/users'
const usersQueryKey = ['users'] as const
const initialUsers: User[] = [
  { roles: [UserRole.Admin], username: 'admin' },
  { roles: [UserRole.User], username: 'johndoe' },
]

export const UsersContext = createContext<{
  users: User[]
  isLoading: boolean
  error: Error | null
  deleteUser: (username: string) => Promise<void>
  addUser: (user: User) => Promise<void>
  updateUser: (username: string, user: User) => Promise<void>
}>({
  addUser: async () => undefined,
  deleteUser: async () => undefined,
  error: null,
  isLoading: true,
  updateUser: async () => undefined,
  users: initialUsers,
})

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const usersQuery = useQuery({
    queryFn: async () => {
      const response = await fetch(usersUrl)
      if (!response.ok) {
        throw new Error(`Unable to fetch users (${response.status})`)
      }
      const apiUsers = (await response.json()) as Array<{
        id: number
        username: string
      }>
      return apiUsers
    },
    queryKey: usersQueryKey,
  })
  const [users, setUsers] = useState<User[]>(initialUsers)

  const provisionUsersMutation = useMutation({
    mutationFn: async (apiUsers: Array<{ id: number; username: string }>) => {
      const provisionedUsers = await Promise.all(
        initialUsers.map(async (initialUser) => {
          const existingUser = apiUsers.find(
            (apiUser) => apiUser.username === initialUser.username,
          )
          if (existingUser) return { ...initialUser, id: existingUser.id }
          const createResponse = await fetch(usersUrl, {
            body: JSON.stringify({
              email: `${initialUser.username}@example.com`,
              name: { firstname: initialUser.username, lastname: 'User' },
              password: 'password',
              username: initialUser.username,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
          if (!createResponse.ok) {
            throw new Error(`Unable to create user (${createResponse.status})`)
          }
          const createdUser = (await createResponse.json()) as { id: number }
          return { ...initialUser, id: createdUser.id }
        }),
      )
      return { apiUsers, provisionedUsers }
    },
    onSuccess: ({ apiUsers, provisionedUsers }) => {
      const provisionedApiUsers = provisionedUsers.map(({ id, username }) => ({
        id,
        username,
      }))
      queryClient.setQueryData(usersQueryKey, [
        ...apiUsers.filter(
          (apiUser) =>
            !provisionedApiUsers.some(
              (provisionedUser) =>
                provisionedUser.username === apiUser.username,
            ),
        ),
        ...provisionedApiUsers,
      ])
      setUsers(provisionedUsers)
    },
  })
  const { mutate: provisionUsers } = provisionUsersMutation

  useEffect(() => {
    const needsProvisioning = usersQuery.data
      ? initialUsers.some(
          (initialUser) =>
            !usersQuery.data?.some(
              (apiUser) => apiUser.username === initialUser.username,
            ),
        )
      : false

    if (needsProvisioning && usersQuery.data) {
      provisionUsers(usersQuery.data)
    }
  }, [provisionUsers, usersQuery.data])

  const deleteUserMutation = useMutation({
    mutationFn: async (username: string) => {
      const user = users.find(
        (currentUser) => currentUser.username === username,
      )
      if (user?.id) {
        const response = await fetch(`${usersUrl}/${user.id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error(`Unable to delete user (${response.status})`)
        }
      }
      return username
    },
    onSuccess: (username) =>
      queryClient.setQueryData<User[]>(usersQueryKey, (currentUsers = []) =>
        currentUsers.filter((user) => user.username !== username),
      ),
  })
  const deleteUser = useCallback(
    (username: string) =>
      deleteUserMutation.mutateAsync(username).then(() => undefined),
    [deleteUserMutation],
  )

  const updateUserMutation = useMutation({
    mutationFn: async ({
      username,
      updatedUser,
    }: {
      username: string
      updatedUser: User
    }) => {
      const currentUser = users.find((user) => user.username === username)
      if (currentUser?.id) {
        const response = await fetch(`${usersUrl}/${currentUser.id}`, {
          body: JSON.stringify({ username: updatedUser.username }),
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
        })
        if (!response.ok) {
          throw new Error(`Unable to update user (${response.status})`)
        }
      }
      return { updatedUser, username }
    },
    onSuccess: ({ updatedUser, username }) =>
      queryClient.setQueryData<User[]>(usersQueryKey, (currentUsers = []) =>
        currentUsers.map((user) =>
          user.username === username ? { ...updatedUser, id: user.id } : user,
        ),
      ),
  })
  const updateUser = useCallback(
    (username: string, updatedUser: User) =>
      updateUserMutation
        .mutateAsync({ updatedUser, username })
        .then(() => undefined),
    [updateUserMutation],
  )

  const addUserMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(usersUrl, {
        body: JSON.stringify({
          email: `${user.username}@example.com`,
          name: { firstname: user.username, lastname: 'User' },
          password: 'password',
          username: user.username,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Unable to create user (${response.status})`)
      }
      return { createdUser: (await response.json()) as { id: number }, user }
    },
    onSuccess: ({ createdUser, user }) =>
      queryClient.setQueryData<User[]>(usersQueryKey, (currentUsers = []) => [
        ...currentUsers,
        { ...user, id: createdUser.id },
      ]),
  })
  const addUser = useCallback(
    (user: User) => addUserMutation.mutateAsync(user).then(() => undefined),
    [addUserMutation],
  )
  const value = useMemo(
    () => ({
      addUser,
      deleteUser,
      error: usersQuery.error,
      isLoading: usersQuery.isPending,
      updateUser,
      users,
    }),
    [
      addUser,
      deleteUser,
      updateUser,
      usersQuery.error,
      usersQuery.isPending,
      users,
    ],
  )

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

export function useUsers() {
  return useContext(UsersContext)
}
