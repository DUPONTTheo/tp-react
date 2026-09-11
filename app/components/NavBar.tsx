import {
  VpNavigationHeader,
  VpNavigationHeaderRow,
  VpIconButton,
  VpBadge,
} from '@vtmn-play/react'
import { VpLogoutIcon } from '@vtmn-play/icons/react'
import { useAuth } from '~/contexts/auth'

export function Nav() {
  const { user, logout } = useAuth()

  return (
    <VpNavigationHeader className="w-full fixed inline-flex justify-center border-b border-vp-background-alt">
      <VpNavigationHeaderRow>
        <img
          src="/images/decathlon-logo.svg"
          alt="Decathlon"
          className="h-4!"
        />

        {user && <div className="flex items-center gap-2">
          <span>{user.username ?? '??'}</span>

          {user?.roles?.map((role) => (
            <VpBadge key={role} variant="primary">
              {role}
            </VpBadge>
          ))}

          <VpIconButton aria-label="Logout" size="small" variant="tertiary" onClick={logout}>
            <VpLogoutIcon />
          </VpIconButton>
        </div>}
      </VpNavigationHeaderRow>
    </VpNavigationHeader>
  )
}
