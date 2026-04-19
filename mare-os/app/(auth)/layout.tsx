import { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MaRe OS</h1>
          <p className="text-slate-600 mt-2">Luxury Fit Score System</p>
        </div>
        {children}
      </div>
    </div>
  )
}