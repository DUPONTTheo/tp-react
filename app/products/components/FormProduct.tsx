import { useEffect } from 'react'
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  VpFormControl,
  VpFormLabel,
  VpInput,
  VpFormError,
  VpSelect,
  VpSelectOption,
  VpTextarea,
} from '@vtmn-play/react'

z.config(z.locales.fr())

const productSchema = z.object({
  category: z.string().min(3),
  description: z.string().min(10),
  image: z.url(),
  price: z.number().min(0),
  title: z.string().min(5),
})

export type ProductFormData = {
  title: string
  price: number
  category: string
  description: string
  image: string
}

function ProductFields({
  errors,
  product,
  register,
}: {
  errors: FieldErrors<ProductFormData>
  product?: ProductFormData
  register: UseFormRegister<ProductFormData>
}) {
  return (
    <div className="w-[300px] flex flex-col gap-3">
      <VpFormControl required>
        <VpFormLabel requiredIndicator={<span>*</span>}>Titre</VpFormLabel>
        <VpInput
          {...register('title', { required: true })}
          name="title"
          placeholder="Entrez le titre du produit"
          defaultValue={product?.title ?? ''}
        />
        {errors.title && <VpFormError>{errors.title.message}</VpFormError>}
      </VpFormControl>

      <VpFormControl required>
        <VpFormLabel requiredIndicator={<span>*</span>}>
          Description
        </VpFormLabel>
        <VpTextarea
          {...register('description', { required: true })}
          name="description"
          placeholder="Entrez la description du produit"
          defaultValue={product?.description ?? ''}
        />
        {errors.description && (
          <VpFormError>{errors.description.message}</VpFormError>
        )}
      </VpFormControl>

      <VpFormControl required>
        <VpFormLabel requiredIndicator={<span>*</span>}>Catégorie</VpFormLabel>
        <VpSelect
          {...register('category', { required: true })}
          name="category"
          placeholder="Entrez la catégorie du produit"
          defaultValue={product?.category ?? ''}
        >
          {product?.category && (
            <VpSelectOption value="">{product.category}</VpSelectOption>
          )}
          <VpSelectOption value="Vêtements">Vêtements</VpSelectOption>
          <VpSelectOption value="Chaussures">Chaussures</VpSelectOption>
          <VpSelectOption value="Accessoires">Accessoires</VpSelectOption>
        </VpSelect>
        {errors.category && (
          <VpFormError>{errors.category.message}</VpFormError>
        )}
      </VpFormControl>

      <VpFormControl required>
        <VpFormLabel requiredIndicator={<span>*</span>}>Image</VpFormLabel>
        <VpInput
          {...register('image', { required: true })}
          name="image"
          placeholder="Entrez l'URL de l'image du produit"
          defaultValue={product?.image ?? ''}
        />
        {errors.image && <VpFormError>{errors.image.message}</VpFormError>}
      </VpFormControl>

      <VpFormControl required>
        <VpFormLabel requiredIndicator={<span>*</span>}>Prix</VpFormLabel>
        <VpInput
          {...register('price', { required: true, valueAsNumber: true })}
          name="price"
          placeholder="Entrez le prix du produit"
          defaultValue={product?.price ?? 0}
          endSlot={<span>€</span>}
        />
        {errors.price && <VpFormError>{errors.price.message}</VpFormError>}
      </VpFormControl>
    </div>
  )
}

export default function FormProduct({
  product,
  onSubmit,
}: {
  product?: ProductFormData
  onSubmit: (data: ProductFormData) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      category: product?.category ?? '',
      description: product?.description ?? '',
      image: product?.image ?? '',
      price: product?.price ?? 0,
      title: product?.title ?? '',
    },
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    reset({
      category: product?.category ?? '',
      description: product?.description ?? '',
      price: product?.price ?? 0,
      title: product?.title ?? '',
    })
  }, [reset, product])

  const submit = (data: ProductFormData) => {
    onSubmit(data)
    reset({ category: '', description: '', price: 0, title: '' })
  }

  return (
    <form
      id={product ? 'edit-product-form' : 'new-product-form'}
      onSubmit={handleSubmit(submit)}
    >
      <ProductFields errors={errors} product={product} register={register} />
    </form>
  )
}
