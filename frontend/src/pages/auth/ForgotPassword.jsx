import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

// Simulated flow: the reset token is shown on screen (with a clear
// demonstration notice) instead of being emailed.
function ForgotPassword() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('request') // request | reset
  const [resetToken, setResetToken] = useState('')
  const [serverError, setServerError] = useState('')

  const requestForm = useForm()
  const resetForm = useForm()

  async function onRequest(values) {
    setServerError('')
    try {
      const response = await api.post('/auth/forgot-password', { email: values.email })
      const token = response.data.data?.resetToken
      if (token) {
        setResetToken(token)
        setPhase('reset')
      } else {
        // Unknown email — identical outward behaviour.
        toast('If an account exists for this email, a reset link has been generated.', 'info')
      }
    } catch (error) {
      setServerError(error.message)
    }
  }

  async function onReset(values) {
    setServerError('')
    try {
      await api.post('/auth/reset-password', {
        token: resetToken,
        newPassword: values.newPassword,
      })
      toast('Password reset successfully. Please log in.', 'success')
      navigate('/login', { replace: true })
    } catch (error) {
      setServerError(error.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="text-2xl font-semibold text-primary">
            Kimty's Collection
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            {phase === 'request' ? 'Reset your password' : 'Choose a new password'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {phase === 'request'
              ? "Enter your account email and we'll set up a reset for you."
              : 'Your reset link is ready — set your new password below.'}
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {serverError && (
            <div role="alert" className="mb-5 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
              {serverError}
            </div>
          )}

          {phase === 'request' ? (
            <form onSubmit={requestForm.handleSubmit(onRequest)} noValidate className="space-y-5">
              <Input
                id="fp-email"
                type="email"
                label="Email Address"
                required
                placeholder="you@example.com"
                autoComplete="email"
                error={requestForm.formState.errors.email?.message}
                {...requestForm.register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address.',
                  },
                })}
              />
              <Button
                type="submit"
                size="lg"
                loading={requestForm.formState.isSubmitting}
                className="w-full"
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onReset)} noValidate className="space-y-5">
              <p className="rounded-md bg-warning-light px-3 py-2 text-xs text-warning">
                Demonstration mode: in a live deployment this step would arrive
                by email. For this academic project the reset continues directly
                on-screen.
              </p>
              <Input
                id="fp-new"
                type="password"
                label="New Password"
                required
                placeholder="At least 8 characters"
                autoComplete="new-password"
                error={resetForm.formState.errors.newPassword?.message}
                {...resetForm.register('newPassword', {
                  required: 'New password is required.',
                  minLength: { value: 8, message: 'New password must be at least 8 characters.' },
                })}
              />
              <Input
                id="fp-confirm"
                type="password"
                label="Confirm New Password"
                required
                autoComplete="new-password"
                error={resetForm.formState.errors.confirmPassword?.message}
                {...resetForm.register('confirmPassword', {
                  required: 'Please confirm your new password.',
                  validate: (value) =>
                    value === resetForm.watch('newPassword') || 'Passwords do not match.',
                })}
              />
              <Button
                type="submit"
                size="lg"
                loading={resetForm.formState.isSubmitting}
                className="w-full"
              >
                Reset Password
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered it?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword