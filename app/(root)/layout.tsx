
import MobileNav from '@/components/shared/MoblieNav'
import Sidebar from '@/components/shared/Sidebar'
import { auth } from '@clerk/nextjs/server'

import { Toaster } from '@/components/ui/toaster'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen w-full bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-10">
          {children}
        </div>
        <Toaster />
      </main>
    );
  }

  return (
    <main className="root">
      <Sidebar />
      <MobileNav />

      <div className="root-container">
        <div className="wrapper">
          {children}
        </div>
      </div>
      
      <Toaster />
    </main>
  )
}

export default Layout
