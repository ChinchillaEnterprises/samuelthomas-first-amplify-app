'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSignupForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }

    setLoading(true);
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep('confirm');
        toast.success('Account created! Please check your email for confirmation code.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.code === 'UsernameExistsException') {
        setErrors({ email: 'An account with this email already exists' });
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmationCode) {
      setErrors({ confirmationCode: 'Confirmation code is required' });
      return;
    }

    setLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode,
      });

      if (isSignUpComplete) {
        // Auto sign in after confirmation
        const { isSignedIn } = await signIn({
          username: email,
          password,
        });

        if (isSignedIn) {
          toast.success('Account confirmed! Welcome to ContextChef.');
          router.push('/onboarding');
        }
      }
    } catch (error: any) {
      console.error('Confirmation error:', error);
      
      if (error.code === 'CodeMismatchException') {
        setErrors({ confirmationCode: 'Invalid confirmation code' });
      } else {
        toast.error('Confirmation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
      });
      toast.success('Confirmation code resent to your email');
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ChefHat className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {step === 'signup' ? 'Create your account' : 'Confirm your email'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'signup' ? (
            <>
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </>
          ) : (
            'We sent a confirmation code to your email'
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="elevated">
          <CardContent className="py-8 px-4 sm:px-10">
            {step === 'signup' ? (
              <form className="space-y-6" onSubmit={handleSignUp}>
                <Input
                  label="Full name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors({ ...errors, name: undefined });
                    }
                  }}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  error={errors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  error={errors.password}
                  hint="At least 8 characters with uppercase, lowercase, and numbers"
                  required
                />

                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  error={errors.confirmPassword}
                  required
                />

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-600 hover:text-green-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  Create account
                </Button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleConfirmSignUp}>
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    We sent a confirmation code to:
                  </p>
                  <p className="font-medium text-gray-900">{email}</p>
                </div>

                <Input
                  label="Confirmation code"
                  type="text"
                  autoComplete="one-time-code"
                  value={confirmationCode}
                  onChange={(e) => {
                    setConfirmationCode(e.target.value);
                    if (errors.confirmationCode) {
                      setErrors({ ...errors, confirmationCode: undefined });
                    }
                  }}
                  error={errors.confirmationCode}
                  placeholder="Enter 6-digit code"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  Confirm account
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={loading}
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}