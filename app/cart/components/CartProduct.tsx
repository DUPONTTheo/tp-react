import {
  VpIconButton,
  VpIcon,
  VpInputQuantity,
  VpDivider,
} from '@vtmn-play/react'
import { useCarts } from '~/contexts/carts'
import type { Product } from '~/types/products'
import type { CartProduct as CartProductType } from '~/types/carts'

export const CartProduct = ({
  productId,
  quantity,
  products,
}: {
  productId: CartProductType['productId']
  quantity: CartProductType['quantity']
  products: Product[]
}) => {
  const { updateProductQuantity, removeProduct } = useCarts()

  return (
    <div key={productId} className="flex flex-col gap-3 mb-3">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate w-94">
          {products.find(({ id }) => id === productId)?.title ??
            'Produit inconnu'}
        </span>

        <div className="flex items-center gap-2">
          <VpInputQuantity
            min={1}
            value={quantity}
            onChange={(event) =>
              void updateProductQuantity(productId, Number(event.target.value))
            }
          />
          <VpIconButton
            aria-label="Remove product"
            variant="negative"
            onClick={() => void removeProduct(productId)}
          >
            <VpIcon name="delete-bin" />
          </VpIconButton>
        </div>
      </div>

      <div>
        <span className="vp-caption">
          {Intl.NumberFormat('fr-FR', {
            currency: 'EUR',
            style: 'currency',
          }).format(
            (products.find(({ id }) => id === productId)?.price ?? 0) *
              quantity,
          )}
        </span>
      </div>

      <VpDivider />
    </div>
  )
}
