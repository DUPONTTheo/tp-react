import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import type { Product } from '~/types/products'

const productsQueryKey = ['products'] as const
const productsUrl = 'https://fakestoreapi.com/products'

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(productsUrl)

  if (!response.ok) {
    throw new Error(`Unable to fetch products (${response.status})`)
  }

  return (await response.json()) as Product[]
}

type ProductsContextValue = UseQueryResult<Product[], Error>

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const productsQuery = useQuery({
    queryFn: getProducts,
    queryKey: productsQueryKey,
  })

  return (
    <ProductsContext.Provider value={productsQuery}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const products = useContext(ProductsContext)

  if (!products) {
    throw new Error('useProducts must be used inside ProductsProvider')
  }

  return products
}
