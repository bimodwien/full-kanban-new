'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/lib/redux/hooks';
import { userLogin } from '@/lib/redux/middleware/auth.middleware';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const initialValues = {
    username: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await dispatch(
          userLogin({
            username: values.username,
            password: values.password,
          }),
        );

        toast.success('Login successful!', {
          duration: 2000,
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } catch (error: any) {
        let errorMessage = 'An error occurred. Please try again.';

        // Extract backend error message
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error('Login failed', {
          description: errorMessage,
          duration: 3000,
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            fontWeight: '500',
          },
        });

        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/modern-office-workspace.png')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-sky-500/10 to-transparent" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="flex w-full max-w-6xl items-center justify-center lg:justify-between gap-12">
          <div className="hidden lg:flex flex-col space-y-8 flex-1">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-white drop-shadow-lg">
                Welcome Back!
              </h1>
              <p className="text-xl text-white/90 font-normal max-w-md">
                Your tasks are waiting. Let&apos;s get started and boost your
                productivity.
              </p>
            </div>
            <div className="w-80 h-80 relative">
              <Image
                src="/kanban-board-illustration.png"
                alt="Kanban Board Illustration"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 320px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <div className="w-full max-w-md lg:max-w-lg">
            <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-black text-gray-900 text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-base">
                  Enter your credentials to access your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...formik.getFieldProps('username')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...formik.getFieldProps('password')}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Log In'}
                  </Button>
                </form>
                <div className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
