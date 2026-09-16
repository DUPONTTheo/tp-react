import { VpSearch } from '@vtmn-play/react/layered'
import { useRef, useState } from 'react'

export default function Products() {
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchValue, setSearchValue] = useState('')

  return (
    <main className="flex max-w-7xl w-full flex-col min-h-svh p-16 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="vp-title-m">Produits</h1>
          <p className="vp-typography-body opacity-60">
            {/* {productsData?.length} produits enregistrés. */}
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
      </div>
    </main>
  )
}
