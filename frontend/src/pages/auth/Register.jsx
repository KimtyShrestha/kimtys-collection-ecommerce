import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { usePageTitle } from '../../hooks/usePageTitle'

function Register() {
  usePageTitle('Create Account')
  const { register: registerAccount } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    setServerError('')
    try {
      await registerAccount({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      })
      toast('Account created successfully. Welcome!', 'success')
      navigate('/', { replace: true })
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Join us for a better way to shop for your little ones
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {serverError && (
            <div
              role="alert"
              className="mb-5 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger"
            >
              {serverError}
            </div>
          )}

          <div className="space-y-5">
            <Input
              id="fullName"
              label="Full Name"
              required
              placeholder="e.g. Sita Sharma"
              autoComplete="name"
              error={errors.fullName?.message}
              {...register('fullName', {
                required: 'Full name is required.',
                maxLength: { value: 100, message: 'Full name must be 100 characters or fewer.' },
              })}
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              required
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address.',
                },
              })}
            />

            <Input
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="98XXXXXXXX"
              autoComplete="tel"
              helper="Optional — used for delivery updates."
              error={errors.phone?.message}
              {...register('phone', {
                maxLength: { value: 20, message: 'Phone number must be 20 characters or fewer.' },
              })}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              required
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required.',
                minLength: { value: 8, message: 'Password must be at least 8 characters.' },
              })}
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              required
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password.',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match.',
              })}
            />

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Create Account
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register