import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { apiUpdateProfile } from '../../services/accountService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

function Profile() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      const updated = await apiUpdateProfile({
        fullName: values.fullName,
        phone: values.phone || undefined,
      })
      refreshUser(updated)
      toast('Profile updated successfully.', 'success')
    } catch (error) {
      setServerError(error.message)
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
      <p className="mt-1 text-sm text-gray-600">
        Your personal details, used for orders and delivery contact.
      </p>

      {serverError && (
        <div role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 max-w-lg space-y-5">
        <Input
          id="fullName"
          label="Full Name"
          required
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName', {
            required: 'Full name is required.',
            maxLength: { value: 100, message: 'Full name must be 100 characters or fewer.' },
          })}
        />
        <Input
          id="email"
          label="Email Address"
          value={user?.email || ''}
          disabled
          helper="Email cannot be changed — it identifies your account."
        />
        <Input
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="98XXXXXXXX"
          autoComplete="tel"
          helper="Used for delivery updates."
          error={errors.phone?.message}
          {...register('phone', {
            maxLength: { value: 20, message: 'Phone number must be 20 characters or fewer.' },
          })}
        />
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save Changes
        </Button>
      </form>
    </section>
  )
}

export default Profile