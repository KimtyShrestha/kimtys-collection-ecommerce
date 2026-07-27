import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Checkbox from '../../components/ui/Checkbox'

function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values) {
    setServerError('')
    try {
      const user = await login({
        email: values.email,
        password: values.password,
        remember: values.remember,
      })
      toast('Logged in successfully.', 'success')
      // Send the user back where they came from, or somewhere sensible.
      const from = location.state?.from
      navigate(from || (user.role === 'admin' ? '/admin' : '/'), { replace: true })
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Log in to continue shopping
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
              id="password"
              type="password"
              label="Password"
              required
              placeholder="Your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required.',
              })}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                id="remember"
                label="Remember me"
                {...register('remember')}
              />
              <span className="text-sm text-gray-400">Forgot password?</span>
            </div>

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Log In
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            New to Kimty's Collection?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login