import {
  VpProductCard,
  VpProductCardHeader,
  VpProductCardMedia,
  VpProductCardSticker,
  VpSticker,
  VpProductCardBody,
  VpProductCardTitle,
  VpProductCardDescription,
  VpProductCardPrice,
  VpPrice,
  VpPriceAmount,
  VpSearch,
  VpCheckboxChip,
} from '@vtmn-play/react'
import type { Product } from '~/types/products'
import { useRef, useState } from 'react'
import { useProducts } from '~/contexts/products'

export default function Catalogue() {
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<
    Product['category'][]
  >([])

  const { data: productsData = [], error, isPending } = useProducts()

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const categories: Product['category'][] = Array.from(
    new Set(productsData?.map((product: Product) => product.category)),
  )

  const filteredProducts = productsData?.filter((product: Product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchValue.toLowerCase())
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category)

    return matchesSearch && matchesCategory
  })

  return (
    <main className="flex max-w-7xl w-full flex-col min-h-svh p-16 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="vp-title-m">Produits</h1>
          <p className="vp-typography-body opacity-60">
            {productsData?.length} produits enregistrés.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <VpSearch
          className="w-fit"
          placeholder="Rechercher un produit"
          value={searchValue}
          onChange={(e) => {
            const { value } = e.target

            if (debounceTimeout.current) {
              clearTimeout(debounceTimeout.current)
            }

            debounceTimeout.current = setTimeout(() => {
              setSearchValue(value)
            }, 300)
          }}
        />

        {categories.map((category) => (
          <VpCheckboxChip
            key={category}
            checked={selectedCategories.includes(category)}
            onChange={(event) => {
              const isChecked = event.target.checked

              setSelectedCategories((currentCategories) =>
                isChecked
                  ? [...currentCategories, category]
                  : currentCategories.filter(
                      (currentCategory) => currentCategory !== category,
                    ),
              )
            }}
          >
            {category}
          </VpCheckboxChip>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] items-stretch gap-10">
        {filteredProducts?.map(
          ({ id, title, description, image, price, category }: Product) => (
            <VpProductCard key={id} className="w-full!">
              <VpProductCardHeader className="h-94! w-full!">
                <VpProductCardMedia className="h-94!">
                  <img
                    alt="Alternative text to media"
                    src={image}
                    className="object-cover! size-full!"
                  />
                </VpProductCardMedia>
                <VpProductCardSticker position="block-end-inline-start">
                  <VpSticker size="small">{category}</VpSticker>
                </VpProductCardSticker>
              </VpProductCardHeader>
              <VpProductCardBody>
                <VpProductCardTitle>{title}</VpProductCardTitle>
                <VpProductCardDescription className="line-clamp-3">
                  {description}
                </VpProductCardDescription>
                <VpProductCardPrice>
                  <VpPrice>
                    <VpPriceAmount>
                      {Intl.NumberFormat('fr-FR', {
                        currency: 'EUR',
                        style: 'currency',
                      }).format(price)}
                    </VpPriceAmount>
                  </VpPrice>
                </VpProductCardPrice>
              </VpProductCardBody>
            </VpProductCard>
          ),
        )}
      </ul>
    </main>
  )
}
