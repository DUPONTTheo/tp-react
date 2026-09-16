import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useAuth } from '~/contexts/auth'
import type { Cart } from '~/types/carts'

const cartsUrl = 'https://fakestoreapi.com/carts'
const cartsQueryKey = ['carts'] as const

export async function getCarts(): Promise<Cart[]> {
  const response = await fetch(cartsUrl)

  if (!response.ok) {
    throw new Error(`Unable to fetch carts (${response.status})`)
  }

  return (await response.json()) as Cart[]
}

type CartsContextValue = {
  carts: Cart[]
  cart: Cart | undefined
  isPending: boolean
  error: Error | null
  addProduct: (productId: number) => Promise<void>
  updateProductQuantity: (productId: number, quantity: number) => Promise<void>
  removeProduct: (productId: number) => Promise<void>
}

const CartsContext = createContext<CartsContextValue | null>(null)

export function CartsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const cartsQuery = useQuery({ queryFn: getCarts, queryKey: cartsQueryKey })
  const carts = cartsQuery.data ?? []

  const userId = user?.id ?? (user?.username === 'admin' ? 1 : 2)
  const cart: Cart | undefined = carts.find(
    (currentCart) => currentCart.userId === userId,
  )

  const saveCartMutation = useMutation({
    mutationFn: async ({
      cart,
      products,
    }: {
      cart?: Cart
      products: Cart['products']
    }) => {
      const response = await fetch(cart ? `${cartsUrl}/${cart.id}` : cartsUrl, {
        body: JSON.stringify({
          date: new Date().toISOString(),
          products,
          userId,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: cart ? 'PUT' : 'POST',
      })
      if (!response.ok) {
        throw new Error(`Unable to save cart (${response.status})`)
      }
      return { cart, products, savedCart: (await response.json()) as Cart }
    },
    onError: (
      _error,
      _variables,
      context: { previousCarts?: Cart[] } | undefined,
    ) => {
      if (context?.previousCarts) {
        queryClient.setQueryData(cartsQueryKey, context.previousCarts)
      }
    },
    onMutate: async ({ cart, products }) => {
      await queryClient.cancelQueries({ queryKey: cartsQueryKey })
      const previousCarts = queryClient.getQueryData<Cart[]>(cartsQueryKey)

      queryClient.setQueryData<Cart[]>(cartsQueryKey, (currentCarts = []) => {
        if (!cart) return currentCarts

        return currentCarts.map((currentCart) =>
          currentCart.id === cart.id
            ? { ...currentCart, products }
            : currentCart,
        )
      })

      return { previousCarts }
    },
    onSuccess: ({ cart, products, savedCart }) => {
      queryClient.setQueryData<Cart[]>(cartsQueryKey, (currentCarts = []) => {
        if (!cart) return [...currentCarts, { ...savedCart, products, userId }]
        return currentCarts.map((currentCart) =>
          currentCart.id === cart.id
            ? { ...cart, ...savedCart, products: currentCart.products }
            : currentCart,
        )
      })
    },
  })

  const addProduct = async (productId: number) => {
    const currentProduct = cart?.products.find(
      (product) => product.productId === productId,
    )

    let products: Cart['products'] = []
    if (cart && currentProduct) {
      products = cart.products.map((product) =>
        product.productId === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      )
    } else if (cart) {
      products = [...cart.products, { productId, quantity: 1 }]
    } else {
      products = [{ productId, quantity: 1 }]
    }

    await saveCartMutation.mutateAsync({ cart, products })
  }

  const updateProductQuantity = async (productId: number, quantity: number) => {
    if (!cart) return

    const products = cart.products
      .map((product) =>
        product.productId === productId ? { ...product, quantity } : product,
      )
      .filter((product) => product.quantity > 0)

    await saveCartMutation.mutateAsync({ cart, products })
  }

  const removeProduct = async (productId: number) => {
    await updateProductQuantity(productId, 0)
  }

  return (
    <CartsContext.Provider
      value={{
        addProduct,
        cart,
        carts,
        error: cartsQuery.error,
        isPending: cartsQuery.isPending,
        removeProduct,
        updateProductQuantity,
      }}
    >
      {children}
    </CartsContext.Provider>
  )
}

export function useCarts() {
  const carts = useContext(CartsContext)

  if (!carts) {
    throw new Error('useCarts must be used inside CartsProvider')
  }

  return carts
}
