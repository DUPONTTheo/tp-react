import {
  VpNavigationHeader,
  VpNavigationHeaderRow,
  VpIconButton,
  VpBadge,
} from '@vtmn-play/react'
import { VpLogoutIcon } from '@vtmn-play/icons/react'
import { useAuth } from '~/contexts/auth'
import NavBarTab from '~/components/NavBarTab'
import type { Tab } from '~/types/tabs'
import { useLocation } from 'react-router'
import { UserRole } from '~/types/auth'

export function Nav() {
  const { pathname } = useLocation()
  const tabs: Tab[] = [
    { name: 'Produits', path: '/' },
    { name: 'Comptes', path: '/accounts' },
  ]
  const { user, logout } = useAuth()

  const filteredTabs = tabs.filter((tab) =>
    tab.name === 'Comptes' && !user?.roles?.includes(UserRole.Admin)
      ? false
      : true,
  )

  const activeTab = filteredTabs.find((tab) =>
    tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path),
  )?.name ?? ''

  return (
    <VpNavigationHeader className="w-full fixed inline-flex justify-center border-b border-vp-background-alt">
      <VpNavigationHeaderRow>
        <div className="inline-flex items-center gap-4">
          <img
            src="/images/decathlon-logo.svg"
            alt="Decathlon"
            className="h-4! mr-8!"
          />

          {filteredTabs.map((tab: Tab) => (
            <NavBarTab
              key={tab.name}
              tab={tab}
              activeTab={activeTab}
            />
          ))}
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <span>{user.username ?? '??'}</span>

            {user?.roles?.map((role) => (
              <VpBadge key={role} variant="primary">
                {role}
              </VpBadge>
            ))}

            <VpIconButton
              aria-label="Logout"
              size="small"
              variant="tertiary"
              onClick={logout}
            >
              <VpLogoutIcon />
            </VpIconButton>
          </div>
        )}
      </VpNavigationHeaderRow>
    </VpNavigationHeader>
  )
}
