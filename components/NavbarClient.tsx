'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'

interface NavbarClientProps {
  session: any
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const user = session?.user

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </span>
              <span className="font-semibold text-slate-800 tracking-tight text-lg">
                RegPortal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors">
              Contact
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 rounded-full bg-slate-50 p-1.5 pr-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white font-semibold flex items-center justify-center shadow-inner">
                    {user.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-50 mb-1">
                      {user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors gap-2"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Settings
                    </Link>
                    <form
                      action={async () => {
                        const { signOut } = await import('next-auth/react')
                        await signOut({ callbackUrl: '/login' })
                      }}
                    >
                      <button
                        type="submit"
                        className="flex w-full items-center px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors gap-2 text-left"
                      >
                        <LogOut className="h-4 w-4 text-rose-400" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-800 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden space-y-3 shadow-inner">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-500 transition-colors"
          >
            Contact
          </Link>
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-500 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-slate-400" />
              Dashboard
            </Link>
          )}

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white font-semibold flex items-center justify-center shadow">
                    {user.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                <form
                  action={async () => {
                    const { signOut } = await import('next-auth/react')
                    await signOut({ callbackUrl: '/login' })
                  }}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
