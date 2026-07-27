import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  apiListAddresses,
  apiCreateAddress,
  apiUpdateAddress,
  apiDeleteAddress,
} from '../../services/accountService'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Checkbox from '../../components/ui/Checkbox'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'

const EMPTY_FORM = {
  label: '',
  recipientName: '',
  phone: '',
  city: 'Kathmandu',
  area: '',
  street: '',
  landmark: '',
  isDefault: false,
}

function Addresses() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState(null) // null = creating
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
      setAddresses(await apiListAddresses())
    } catch {
      setAddresses([])
      toast('Could not load your addresses.', 'error')
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCreate() {
    setEditing(null)
    setServerError('')
    reset(EMPTY_FORM)
    setEditorOpen(true)
  }

  function openEdit(address) {
    setEditing(address)
    setServerError('')
    reset({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      city: address.city,
      area: address.area,
      street: address.street || '',
      landmark: address.landmark || '',
      isDefault: address.isDefault,
    })
    setEditorOpen(true)
  }

  async function onSubmit(values) {
    setServerError('')
    try {
      if (editing) {
        await apiUpdateAddress(editing.id, values)
        toast('Address updated successfully.', 'success')
      } else {
        await apiCreateAddress(values)
        toast('Address added successfully.', 'success')
      }
      setEditorOpen(false)
      load()
    } catch (error) {
      setServerError(error.message)
    }
  }

  async function confirmDelete() {
    try {
      await apiDeleteAddress(deleteTarget.id)
      toast('Address deleted.', 'success')
      setDeleteTarget(null)
      load()
    } catch (error) {
      toast(error.message, 'error')
      setDeleteTarget(null)
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
          <p className="mt-1 text-sm text-gray-600">
            Saved delivery addresses for faster checkout.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add Address
        </Button>
      </div>

      {addresses === null ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : addresses.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={MapPin}
            title="No saved addresses"
            message="Add an address to speed up your next checkout."
            action={<Button onClick={openCreate}>Add Your First Address</Button>}
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">{address.label}</p>
                {address.isDefault && <Badge variant="primary">Default</Badge>}
              </div>
              <p className="mt-2 flex-1 text-sm text-gray-600">
                {address.recipientName}
                <br />
                {address.area}, {address.city}
                {address.street && <><br />{address.street}</>}
                {address.landmark && <><br />{address.landmark}</>}
                <br />
                {address.phone}
              </p>
              <div className="mt-4 flex gap-2 border-t border-gray-200 pt-3">
                <Button size="sm" variant="secondary" onClick={() => openEdit(address)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(address)}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? 'Edit Address' : 'Add Address'}
      >
        {serverError && (
          <div role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="label" label="Label" required placeholder="Home, Office…"
              error={errors.label?.message}
              {...register('label', { required: 'Label is required.' })}
            />
            <Input
              id="recipientName" label="Recipient Name" required
              error={errors.recipientName?.message}
              {...register('recipientName', { required: 'Recipient name is required.' })}
            />
            <Input
              id="addr-phone" type="tel" label="Phone" required placeholder="98XXXXXXXX"
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone number is required.' })}
            />
            <Input
              id="addr-city" label="City" required
              error={errors.city?.message}
              {...register('city', { required: 'City is required.' })}
            />
            <Input
              id="addr-area" label="Area" required placeholder="e.g. Basundhara"
              error={errors.area?.message}
              {...register('area', { required: 'Area is required.' })}
            />
            <Input
              id="addr-street" label="Street" placeholder="Optional"
              {...register('street')}
            />
            <Input
              id="addr-landmark" label="Landmark" placeholder="Optional"
              className="sm:col-span-2"
              {...register('landmark')}
            />
          </div>
          <Checkbox id="addr-default" label="Set as default address" {...register('isDefault')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editing ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete address?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Delete <span className="font-medium text-gray-900">{deleteTarget?.label}</span>?
          This cannot be undone.
        </p>
      </Modal>
    </section>
  )
}

export default Addresses