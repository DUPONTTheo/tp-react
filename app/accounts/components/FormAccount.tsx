import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  VpFormControl,
  VpFormLabel,
  VpInput,
  VpFormError,
  VpSelect,
  VpSelectOption,
} from '@vtmn-play/react'
import { type User, UserRole } from '~/types/auth'

z.config(z.locales.fr())

const userSchema = z.object({
  role: z.enum([UserRole.Admin, UserRole.User]),
  username: z.string().min(5),
})
export type AccountFormData = { username: string; role: UserRole }

export default function FormAccount({
  user,
  onSubmit,
}: {
  user?: User
  onSubmit: (data: AccountFormData) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    defaultValues: {
      role: user?.roles?.[0] ?? UserRole.User,
      username: user?.username ?? '',
    },
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    reset({
      role: user?.roles?.[0] ?? UserRole.User,
      username: user?.username ?? '',
    })
  }, [reset, user])

  const submit = (data: AccountFormData) => {
    onSubmit(data)
    reset({ role: UserRole.User, username: '' })
  }

  return (
    <form
      id={user ? 'edit-user-form' : 'new-user-form'}
      onSubmit={handleSubmit(submit)}
    >
      <div className="w-[300px] flex flex-col gap-3">
        <VpFormControl required>
          <VpFormLabel requiredIndicator={<span>*</span>}>
            Nom d'utilisateur
          </VpFormLabel>
          <VpInput
            {...register('username', { required: true })}
            name="username"
            placeholder="Entrez votre nom d'utilisateur"
            defaultValue={user?.username ?? ''}
          />
          {errors.username && (
            <VpFormError>{errors.username.message}</VpFormError>
          )}
        </VpFormControl>

        <VpFormControl required>
          <VpFormLabel requiredIndicator={<span>*</span>}>Rôle</VpFormLabel>
          <VpSelect
            {...register('role', { required: true })}
            name="role"
            placeholder="Entrez le rôle de l'utilisateur"
            defaultValue={user?.roles?.[0] ?? UserRole.User}
          >
            <VpSelectOption value={UserRole.Admin}>Admin</VpSelectOption>
            <VpSelectOption value={UserRole.User}>User</VpSelectOption>
          </VpSelect>
          {errors.role && <VpFormError>{errors.role.message}</VpFormError>}
        </VpFormControl>
      </div>
    </form>
  )
}
