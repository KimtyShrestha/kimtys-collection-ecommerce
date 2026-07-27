import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, FolderTree, ArrowRight } from 'lucide-react'
import {
  apiListAdminCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
} from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Checkbox from '../../components/ui/Checkbox'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const EMPTY_FORM = { name: '', description: '', sortOrder: '0', isActive: true }

function AdminCategories() {
  const { toast } = useToast()
  const [categories, setCategories] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM })

  async function load() {
    try {
      setCategories(await apiListAdminCategories())
    } catch (error) {
      toast(error.message, 'error')
      setCategories([])
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCreate() {
    setEditing(null)
    setServerError('')
    // Suggest the next sort position so new categories land at the end.
    const nextOrder = categories?.length
      ? Math.max(...categories.map((category) => category.sortOrder)) + 1
      : 0
    reset({ ...EMPTY_FORM, sortOrder: String(nextOrder) })
    setEditorOpen(true)
  }

  function openEdit(category) {
    setEditing(category)
    setServerError('')
    reset({
      name: category.name,
      description: category.description || '',
      sortOrder: String(category.sortOrder),
      isActive: category.isActive,
    })
    setEditorOpen(true)
  }

  async function onSubmit(values) {
    setServerError('')
    const payload = {
      name: values.name,
      description: values.description,
      sortOrder: Number(values.sortOrder) || 0,
      isActive: values.isActive,
    }
    try {
      if (editing) {
        await apiUpdateCategory(editing.id, payload)
        toast('Category updated successfully.', 'success')
      } else {
        await apiCreateCategory(payload)
        toast('Category created successfully.', 'success')
      }
      setEditorOpen(false)
      load()
    } catch (error) {
      setServerError(error.message)
    }
  }

  async function confirmDelete() {
    try {
      await apiDeleteCategory(deleteTarget.id)
      toast('Category deleted.', 'success')
      setDeleteTarget(null)
      load()
    } catch (error) {
      // e.g. "This category still contains products..."
      toast(error.message, 'error')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        subtitle={
          categories ? `${categories.length} categories organising the catalogue` : 'Loading…'
        }
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add Category
          </Button>
        }
      />

      {categories === null ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          message="Categories help customers browse the catalogue. Add your first one to get started."
          action={<Button onClick={openCreate}>Add Category</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-180 text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-gray-600">Order</th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-600">Category</th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-600">Products</th>
                <th scope="col" className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{category.sortOrder}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{category.name}</p>
                    {category.description && (
                      <p className="mt-0.5 max-w-md truncate text-xs text-gray-400">
                        {category.description}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-gray-400">/{category.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {category.productCount > 0 ? (
                      <Link
                        to={`/admin/products?category=${category.slug}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {category.productCount}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {category.isActive
                      ? <Badge variant="success">Active</Badge>
                      : <Badge variant="neutral">Hidden</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEdit(category)}
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(category)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / edit modal */}
      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        {serverError && (
          <div role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            id="category-name"
            label="Category Name"
            required
            placeholder="e.g. Rainwear"
            helper={editing ? 'Renaming updates the storefront URL for this category.' : undefined}
            error={errors.name?.message}
            {...register('name', {
              required: 'Category name is required.',
              maxLength: { value: 60, message: 'Name must be 60 characters or fewer.' },
            })}
          />
          <Textarea
            id="category-description"
            label="Description"
            rows={3}
            placeholder="A short description shown on the categories page."
            error={errors.description?.message}
            {...register('description', {
              maxLength: { value: 500, message: 'Description must be 500 characters or fewer.' },
            })}
          />
          <Input
            id="category-sort"
            type="number"
            min="0"
            label="Sort Order"
            helper="Lower numbers appear first in navigation and on the homepage."
            error={errors.sortOrder?.message}
            {...register('sortOrder', {
              min: { value: 0, message: 'Sort order must be zero or greater.' },
            })}
          />
          <Checkbox
            id="category-active"
            label="Active (visible to customers)"
            {...register('isActive')}
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete category?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Delete <span className="font-medium text-gray-900">{deleteTarget?.name}</span>?
          {deleteTarget?.productCount > 0 ? (
            <>
              {' '}This category currently holds{' '}
              <span className="font-medium text-gray-900">{deleteTarget.productCount}</span>{' '}
              products, so it cannot be deleted. Move those products to another
              category first, or hide this category instead by unticking "Active".
            </>
          ) : (
            ' This cannot be undone.'
          )}
        </p>
      </Modal>
    </div>
  )
}

export default AdminCategories