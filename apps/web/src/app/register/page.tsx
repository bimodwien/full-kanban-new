'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/axios';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    username: '',
    email: '',
    password: '',
    fullName: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      fullName: Yup.string().required('Full name is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await axiosInstance().post('/users/register', values);
        toast.success('Registration successful!', {
          description: 'You can now log in with your new account.',
        });
        setTimeout(() => {
          window.location.href = '/login';
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

        toast.error('Registration failed', {
          description: errorMessage,
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.png')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="flex w-full max-w-6xl items-center justify-center lg:justify-between gap-12">
          <div className="hidden lg:flex flex-col space-y-8 flex-1">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-white drop-shadow-lg">
                Join Us!
              </h1>
              <p className="text-xl text-white/90 font-normal max-w-md">
                Create your workspace and boost your productivity with our
                powerful task management tools.
              </p>
            </div>
            <div className="w-80 h-80 relative">
              <Image
                src="/team-collaboration.png"
                alt="Team Collaboration Illustration"
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
                  Create Account
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-base">
                  Fill in your information to join our community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                      placeholder="Choose a username"
                      {...formik.getFieldProps('username')}
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...formik.getFieldProps('email')}
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      {...formik.getFieldProps('fullName')}
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      placeholder="Create a password"
                      {...formik.getFieldProps('password')}
                      className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
