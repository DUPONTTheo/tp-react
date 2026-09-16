import {
  VpNavigationHeader,
  VpNavigationHeaderRow,
  VpIconButton,
  VpBadge,
  VpIcon,
  VpModal,
  VpModalBody,
  VpModalCloseButton,
  VpModalDialog,
  VpModalHeader,
  VpButton,
} from '@vtmn-play/react'
import { VpLogoutIcon } from '@vtmn-play/icons/react'
import { useAuth } from '~/contexts/auth'
import NavBarTab from '~/components/NavBarTab'
import type { Tab } from '~/types/tabs'
import { useLocation } from 'react-router'
import { useState } from 'react'
import { UserRole } from '~/types/auth'
import { useCarts } from '~/contexts/carts'
import { useProducts } from '~/contexts/products'
import { CartProduct } from '~/cart/components/CartProduct'

export function Nav() {
  const { pathname } = useLocation()
  const tabs: Tab[] = [
    { name: 'Catalogue', path: '/' },
    { name: 'Produits', path: '/products' },
    { name: 'Comptes', path: '/accounts' },
  ]
  const { user, logout } = useAuth()
  const { cart } = useCarts()
  const { data: products = [] } = useProducts()
  const cartCount =
    cart?.products.reduce((total, product) => total + product.quantity, 0) ?? 0
  const [isCartOpen, setIsCartOpen] = useState(false)

  const filteredTabs = tabs.filter((tab) =>
    (tab.name === 'Comptes' || tab.name === 'Produits') &&
    !user?.roles?.includes(UserRole.Admin)
      ? false
      : true,
  )

  const activeTab =
    filteredTabs.find((tab) =>
      tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path),
    )?.name ?? ''

  return (
    <VpNavigationHeader className="z-9999 w-full fixed inline-flex justify-center border-b border-vp-background-alt">
      <VpNavigationHeaderRow>
        <div className="inline-flex items-center gap-4">
          <img
            src="/images/decathlon-logo.svg"
            alt="Decathlon"
            className="h-4! mr-8!"
          />

          {filteredTabs.map((tab: Tab) => (
            <NavBarTab key={tab.name} tab={tab} activeTab={activeTab} />
          ))}
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <VpIconButton
              variant="tertiary"
              aria-label="Open cart"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <VpIcon name="shopping-bag" />
              <VpBadge variant="primary" className="absolute! bottom-1 right-1">
                {cartCount}
              </VpBadge>
            </VpIconButton>

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

        <VpModal open={isCartOpen} onClose={() => setIsCartOpen(false)}>
          <VpModalDialog aria-label="Shopping cart">
            <VpModalHeader>
              <h2>Panier - {cart?.products.length ?? 0} article(s)</h2>
              <VpModalCloseButton aria-label="Close cart" />
            </VpModalHeader>
            <VpModalBody className="p-8">
              {cart?.products.length ? (
                cart.products.map(({ productId, quantity }) => (
                  <CartProduct
                    key={productId}
                    productId={productId}
                    quantity={quantity}
                    products={products}
                  />
                ))
              ) : (
                <p>Votre panier est vide.</p>
              )}

              {cart?.products.length ? (
                <div className="flex items-center justify-between mt-4">
                  <span className="vp-subtitle-m">
                    Total:{' '}
                    {Intl.NumberFormat('fr-FR', {
                      currency: 'EUR',
                      style: 'currency',
                    }).format(
                      cart.products.reduce((total, { productId, quantity }) => {
                        const productPrice =
                          products.find(({ id }) => id === productId)?.price ??
                          0
                        return total + productPrice * quantity
                      }, 0),
                    )}
                  </span>

                  <VpButton variant="primary">Commander</VpButton>
                </div>
              ) : null}
            </VpModalBody>
          </VpModalDialog>
        </VpModal>
      </VpNavigationHeaderRow>
    </VpNavigationHeader>
  )
}
