'use client'
import Link from 'next/link'
import NavMenu from './NavMenu'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
export default function NavBar() {
  const { data: session, status } = useSession()
  // const queryClient = useQueryClient()
  

  const handleSignOut = async () => {
    // Signing out with next-auth and redirecting to login page
    await signOut({ redirect: true });
  };

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: 'http://localhost:3000/contact' })
  }

  console.log(session?.user?.email)

  // check if you are first time user


  return (
      <nav className="flex items-center justify-between bg-blue-400 h-14 text-slate-50 w-full">
      {/* Logo */}
        <Link href="/" className="sm:text-sm md:text-2xl ml-2">
          findfoodpantries.<span className="text-yellow-300">com</span>
        </Link>
        <div className='flex justify-center items-center gap-3 mr-2'>
          {session ? (
            <>
              <Link
                    href={`/pantry`}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-inherit px-2 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Register Food Bank
              </Link>
              <Link
                    href={`/contact`}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-inherit px-2 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Subscribe
              </Link>

              <button
                onClick={handleSignOut}
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-primary px-2 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Sign out
              </button>
            </>
          ) :             
          
            <button
            onClick={handleSignIn}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-primary px-2 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
          >
            Sign in
          </button>}
        </div>
      </nav>
  )
}