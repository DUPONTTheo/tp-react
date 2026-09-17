import {
  VpSearch,
  VpModal,
  VpModalTriggerButton,
  VpIcon,
  VpModalDialog,
  VpModalHeader,
  VpModalCloseButton,
  VpModalBody,
  VpModalFooter,
  VpButton,
  VpIconButton,
  VpBadge,
} from '@vtmn-play/react'
import { useRef, useState } from 'react'
import { useProducts } from '~/contexts/products'
import Table from '~/products/components/Table'
import FormProduct from '~/products/components/FormProduct'
import type { Product } from '~/types/products'
import type { ProductFormData } from '~/products/components/FormProduct'

export default function Products() {
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product>()

  const openCreateModal = () => {
    setEditingProduct(undefined)
    setIsProductModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsProductModalOpen(true)
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deletingProduct = useRef<Product | undefined>(undefined)

  const openDeleteModal = (product: Product) => {
    deletingProduct.current = product
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    deletingProduct.current = undefined
  }

  const closeProductModal = () => {
    setIsProductModalOpen(false)
    setEditingProduct(undefined)
  }

  const {
    data: productsData = [],
    error,
    isPending,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts()

  const saveProduct = async (product: ProductFormData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, product)
    } else {
      await addProduct(product)
    }

    closeProductModal()
  }

  const formId = editingProduct ? 'edit-product-form' : 'new-product-form'

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const filteredProducts = productsData.filter((product) =>
    `${product.title} ${product.category}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  )

  return (
    <main className="flex max-w-7xl w-full flex-col min-h-svh p-16 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="vp-title-m">Produits</h1>
          <p className="vp-typography-body opacity-60">
            {productsData?.length} produits enregistrés.
          </p>
        </div>

        <VpModal open={isProductModalOpen} onClose={closeProductModal}>
          <VpModalTriggerButton onClick={openCreateModal}>
            <VpIcon name="add" />
            Ajouter un produit
          </VpModalTriggerButton>
          <VpModalDialog
            aria-label={
              editingProduct ? 'Modifier un produit' : 'Créer un produit'
            }
          >
            <VpModalHeader>
              <h2>
                {editingProduct ? 'Modifier le produit' : 'Créer un produit'}
              </h2>
              <VpModalCloseButton aria-label="Fermer le formulaire de produit" />
            </VpModalHeader>
            <VpModalBody className="p-8">
              <FormProduct
                key={editingProduct?.title ?? 'new'}
                product={editingProduct}
                onSubmit={saveProduct}
              />
            </VpModalBody>
            <VpModalFooter className="flex justify-end gap-2">
              <VpButton type="submit" form={formId}>
                {editingProduct ? 'Enregistrer' : 'Créer le produit'}
              </VpButton>
            </VpModalFooter>
          </VpModalDialog>
        </VpModal>
      </div>

      <div className="flex items-center gap-4 flex-wrap mb-8">
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

      <VpModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <VpModalDialog aria-label="Modal de dialogue de suppression de produit">
          <VpModalHeader>
            <h2>Supprimer le produit</h2>
            <VpModalCloseButton aria-label="Fermer le modal de suppression de produit" />
          </VpModalHeader>
          <VpModalBody className="p-8">
            <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
          </VpModalBody>
          <VpModalFooter className="flex justify-end gap-2">
            <VpButton variant="secondary" onClick={closeDeleteModal}>
              Annuler
            </VpButton>
            <VpButton
              variant="negative"
              onClick={() => {
                if (!deletingProduct.current) return
                deleteProduct(deletingProduct.current.id)
                closeDeleteModal()
              }}
            >
              Supprimer
            </VpButton>
          </VpModalFooter>
        </VpModalDialog>
      </VpModal>

      <Table
        columns={[
          { label: 'Titre', size: '40%', value: 'title' },
          { label: 'Prix', size: '20%', value: 'price' },
          { label: 'Catégorie', size: '20%', value: 'category' },
          { label: 'Actions', size: '20%', value: 'actions' },
        ]}
        data={filteredProducts.map((product) => ({
          ...product,
          actions: (
            <div className="flex gap-2">
              <VpIconButton size="small" onClick={() => openEditModal(product)}>
                <VpIcon name="edit" />
              </VpIconButton>

              <VpIconButton
                variant="negative"
                size="small"
                onClick={() => openDeleteModal(product)}
              >
                <VpIcon name="delete-bin" />
              </VpIconButton>
            </div>
          ),
          category: <VpBadge>{product.category}</VpBadge>,
          price: Intl.NumberFormat('fr-FR', {
            currency: 'EUR',
            style: 'currency',
          }).format(product.price),
        }))}
      />
    </main>
  )
}
