import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Upload, X, ImageIcon } from 'lucide-react'
import {
  apiGetAdminProduct,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProductImage,
  apiListAdminCategories,
} from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Checkbox from '../../components/ui/Checkbox'
import Spinner from '../../components/ui/Spinner'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
const MAX_IMAGES = 4

const AGE_OPTIONS = [
  { value: 'all', label: 'All ages' },
  { value: '0-2', label: '0–2 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '6-9', label: '6–9 years' },
  { value: '10-14', label: '10–14 years' },
]

function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { toast } = useToast()

  const [categories, setCategories] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '', categoryId: '', description: '', price: '', discountPrice: '',
      stock: '', ageGroup: 'all', size: '', colour: '',
      isFeatured: false, isNewArrival: false, isPopular: false, isActive: true,
    },
  })

  useEffect(() => {
    apiListAdminCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    apiGetAdminProduct(id)
      .then((product) => {
        reset({
          name: product.name,
          categoryId: String(product.categoryId),
          description: product.description || '',
          price: String(product.price),
          discountPrice: product.discountPrice === null ? '' : String(product.discountPrice),
          stock: String(product.stock),
          ageGroup: product.ageGroup,
          size: product.size || '',
          colour: product.colour || '',
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isPopular: product.isPopular,
          isActive: product.isActive,
        })
        setExistingImages(product.images)
      })
      .catch(() => toast('Could not load this product.', 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function onFilesSelected(event) {
    const selected = Array.from(event.target.files || [])
    const room = MAX_IMAGES - existingImages.length - newFiles.length
    if (selected.length > room) {
      toast(`You can have up to ${MAX_IMAGES} images per product.`, 'error')
    }
    setNewFiles((current) => [...current, ...selected.slice(0, Math.max(0, room))])
    event.target.value = '' // allow re-selecting the same file
  }

  function removeNewFile(index) {
    setNewFiles((current) => current.filter((_, i) => i !== index))
  }

  async function removeExistingImage(imageId) {
    try {
      await apiDeleteProductImage(id, imageId)
      setExistingImages((current) => current.filter((image) => image.id !== imageId))
      toast('Image deleted.', 'success')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  async function onSubmit(values) {
    setServerError('')
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value === null || value === undefined ? '' : String(value))
    })
    newFiles.forEach((file) => formData.append('images', file))

    try {
      if (isEdit) {
        await apiUpdateProduct(id, formData)
        toast('Product updated successfully.', 'success')
      } else {
        await apiCreateProduct(formData)
        toast('Product created successfully.', 'success')
      }
      navigate('/admin/products')
    } catch (error) {
      setServerError(error.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  const totalImages = existingImages.length + newFiles.length

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Products
        </Link>
      </div>

      <AdminPageHeader
        title={isEdit ? 'Edit Product' : 'Add Product'}
        subtitle={isEdit ? 'Update the details of this product.' : 'Add a new product to the catalogue.'}
      />

      {serverError && (
        <div role="alert" className="rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                id="name" label="Product Name" required className="sm:col-span-2"
                placeholder="e.g. Cotton Summer Dress"
                error={errors.name?.message}
                {...register('name', { required: 'Product name is required.' })}
              />
              <Select
                id="categoryId" label="Category" required
                placeholder="Select a category"
                options={categories.map((category) => ({
                  value: String(category.id), label: category.name,
                }))}
                error={errors.categoryId?.message}
                {...register('categoryId', { required: 'Please select a category.' })}
              />
              <Select
                id="ageGroup" label="Age Group" options={AGE_OPTIONS}
                {...register('ageGroup')}
              />
              <Input
                id="size" label="Size" placeholder="e.g. 3-4 / 4-5 years"
                {...register('size')}
              />
              <Input
                id="colour" label="Colour" placeholder="e.g. Navy Blue"
                {...register('colour')}
              />
              <Textarea
                id="description" label="Description" rows={5} className="sm:col-span-2"
                placeholder="Describe the product — material, fit, care instructions…"
                {...register('description')}
              />
            </div>
          </section>

          {/* Images */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">Images</h2>
            <p className="mt-1 text-sm text-gray-600">
              Up to {MAX_IMAGES} images (JPG, PNG or WebP, max 2 MB each). The first
              image is used as the main product photo.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                  <img src={`${API_ORIGIN}${image.imagePath}`} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    aria-label="Delete image"
                    className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-gray-600 shadow-sm hover:bg-danger hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {image.isPrimary && (
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Main
                    </span>
                  )}
                </div>
              ))}

              {newFiles.map((file, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-primary-border">
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    aria-label="Remove selected image"
                    className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-gray-600 shadow-sm hover:bg-danger hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    New
                  </span>
                </div>
              ))}

              {totalImages < MAX_IMAGES && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-primary hover:text-primary">
                  <Upload className="h-6 w-6" aria-hidden="true" />
                  <span className="text-xs font-medium">Add image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onFilesSelected}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            {totalImages === 0 && (
              <p className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                No images yet — the store will show a placeholder.
              </p>
            )}
          </section>
        </div>

        {/* Sidebar: pricing, stock, flags */}
        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">Pricing & Stock</h2>
            <div className="mt-4 space-y-4">
              <Input
                id="price" type="number" step="0.01" min="0" label="Price (Rs.)" required
                error={errors.price?.message}
                {...register('price', {
                  required: 'Price is required.',
                  min: { value: 0.01, message: 'Price must be greater than zero.' },
                })}
              />
              <Input
                id="discountPrice" type="number" step="0.01" min="0" label="Discount Price (Rs.)"
                helper="Leave empty if not on sale. Must be lower than the price."
                error={errors.discountPrice?.message}
                {...register('discountPrice')}
              />
              <Input
                id="stock" type="number" min="0" label="Stock Quantity" required
                error={errors.stock?.message}
                {...register('stock', {
                  required: 'Stock is required.',
                  min: { value: 0, message: 'Stock cannot be negative.' },
                })}
              />
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">Visibility</h2>
            <div className="mt-4 space-y-3">
              <Checkbox id="isActive" label="Active (visible in store)" {...register('isActive')} />
              <Checkbox id="isFeatured" label="Featured on homepage" {...register('isFeatured')} />
              <Checkbox id="isNewArrival" label="New arrival" {...register('isNewArrival')} />
              <Checkbox id="isPopular" label="Popular product" {...register('isPopular')} />
            </div>
          </section>

          <div className="flex gap-3">
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
            <Link to="/admin/products">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm