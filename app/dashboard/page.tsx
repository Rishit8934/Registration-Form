import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome, {session.user?.name}! 👋
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Logged in as {session.user?.email}
        </p>
        <form action={async () => {
          'use server'
          const { signOut } = await import('@/auth')
          await signOut({ redirectTo: '/login' })
        }}>
          <button className="w-full bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}