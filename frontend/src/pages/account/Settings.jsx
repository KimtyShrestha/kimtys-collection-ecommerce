import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '../../context/ToastContext'
import { apiChangePassword } from '../../services/accountService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

function Settings() {
  const { toast } = useToast()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    setServerError('')
    try {
      await apiChangePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      reset()
      toast('Password changed successfully.', 'success')
    } catch (error) {
      setServerError(error.message)
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
      <p className="mt-1 text-sm text-gray-600">Change your account password.</p>

      {serverError && (
        <div role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 max-w-lg space-y-5">
        <Input
          id="currentPassword"
          type="password"
          label="Current Password"
          required
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Current password is required.' })}
        />
        <Input
          id="newPassword"
          type="password"
          label="New Password"
          required
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'New password is required.',
            minLength: { value: 8, message: 'New password must be at least 8 characters.' },
          })}
        />
        <Input
          id="confirmNewPassword"
          type="password"
          label="Confirm New Password"
          required
          autoComplete="new-password"
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword', {
            required: 'Please confirm your new password.',
            validate: (value) => value === watch('newPassword') || 'Passwords do not match.',
          })}
        />
        <Button type="submit" loading={isSubmitting}>Change Password</Button>
      </form>
    </section>
  )
}

export default Settings