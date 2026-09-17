import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import type { Product } from '~/types/products'

const productsQueryKey = ['products'] as const
const productsUrl = 'https://fakestoreapi.com/products'

export type ProductInput = Pick<
  Product,
  'title' | 'price' | 'description' | 'category' | 'image'
>

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(productsUrl)

  if (!response.ok) {
    throw new Error(`Unable to fetch products (${response.status})`)
  }

  return (await response.json()) as Product[]
}

async function createProduct(product: ProductInput): Promise<Product> {
  const response = await fetch(productsUrl, {
    body: JSON.stringify(product),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Unable to create product (${response.status})`)
  }

  return (await response.json()) as Product
}

async function updateProduct(
  productId: number,
  product: ProductInput,
): Promise<Product> {
  const response = await fetch(`${productsUrl}/${productId}`, {
    body: JSON.stringify(product),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  })

  if (!response.ok) {
    throw new Error(`Unable to update product (${response.status})`)
  }

  return (await response.json()) as Product
}

async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${productsUrl}/${productId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Unable to delete product (${response.status})`)
  }
}

type ProductsContextValue = UseQueryResult<Product[], Error> & {
  addProduct: (product: ProductInput) => Promise<Product>
  updateProduct: (productId: number, product: ProductInput) => Promise<Product>
  deleteProduct: (productId: number) => Promise<void>
}

export const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const productsQuery = useQuery({
    queryFn: getProducts,
    queryKey: productsQueryKey,
  })

  const addProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (createdProduct) => {
      queryClient.setQueryData<Product[]>(productsQueryKey, (products = []) => [
        ...products,
        createdProduct,
      ])
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: ({
      product,
      productId,
    }: {
      product: ProductInput
      productId: number
    }) => updateProduct(productId, product),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<Product[]>(productsQueryKey, (products = []) =>
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        ),
      )
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: (_data, productId) => {
      queryClient.setQueryData<Product[]>(productsQueryKey, (products = []) =>
        products.filter((product) => product.id !== productId),
      )
    },
  })

  return (
    <ProductsContext.Provider
      value={{
        ...productsQuery,
        addProduct: addProductMutation.mutateAsync,
        deleteProduct: (productId) =>
          deleteProductMutation.mutateAsync(productId),
        updateProduct: (productId, product) =>
          updateProductMutation.mutateAsync({ product, productId }),
      }}
    >
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
