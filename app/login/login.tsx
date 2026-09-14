import {
  VpButton,
  VpFormControl,
  VpFormLabel,
  VpInput,
  VpIcon,
  VpFormError,
} from '@vtmn-play/react'
import { useNavigate } from 'react-router'
import { useForm, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/auth'
import { useUsers } from '~/contexts/users'
import * as z from 'zod'

z.config(z.locales.fr())

const VALID_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  johndoe: 'client123',
}

const loginSchema = z.object({
  password: z.string().min(5),
  username: z.string().min(5),
})

export function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { users } = useUsers()

  const login = (data: FieldValues) => {
    const account = users.find((user) => user.username === data.username)

    if (!account || VALID_PASSWORDS[account.username] !== data.password) {
      setError('password', {
        message: "Nom d'utilisateur ou mot de passe invalide",
        type: 'validate',
      })
      return
    }

    localStorage.setItem('user', JSON.stringify(account))

    setUser(account)

    navigate('/')
  }

  return (
    <main className="flex flex-col items-center justify-center gap-4 h-svh">
      <div className="flex flex-col items-center gap-2">
        <h1 className="vp-title-l">Connexion</h1>
        <p className="vp-typography-body mb-8!">
          Accédez à votre compte en vous connectant ci-dessous.
        </p>

        <form onSubmit={handleSubmit((data) => login(data))}>
          <div className="w-[300px] flex flex-col gap-3">
            <VpFormControl required>
              <VpFormLabel requiredIndicator={<span>*</span>}>
                Nom d'utilisateur
              </VpFormLabel>
              <VpInput
                {...register('username', { required: true })}
                name="username"
                placeholder="Entrez votre nom d'utilisateur"
              />
              {errors.username && (
                <VpFormError>{errors.username.message}</VpFormError>
              )}
            </VpFormControl>

            <VpFormControl required>
              <VpFormLabel requiredIndicator={<span>*</span>}>
                Mot de passe
              </VpFormLabel>
              <VpInput
                {...register('password', { required: true })}
                name="password"
                placeholder="Entrez votre mot de passe"
              />
              {errors.password && (
                <VpFormError>{errors.password.message}</VpFormError>
              )}
            </VpFormControl>

            <VpButton type="submit" className="w-full">
              Se connecter
            </VpButton>
          </div>
        </form>

        <span className="flex items-center gap-1 !p-1 bg-vp-status-info text-vp-white">
          <VpIcon name="warning-error" />
          <div className="flex flex-col gap-1">
            <span className="vp-subtitle-m">Comptes de démonstration</span>
            <span>Admin: admin / admin123</span>
            <span>Client: johndoe / client123</span>
          </div>
        </span>
      </div>
    </main>
  )
}
