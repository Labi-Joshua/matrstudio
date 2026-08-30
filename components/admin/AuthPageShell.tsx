import type { ReactNode } from 'react'
import Image from 'next/image'

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen p-4">
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="px-10 pt-10 sm:px-16 lg:px-24">
          <Image src="/matrstudio..png" alt="Matrstudio" width={110} height={17} priority />
        </div>

        <div className="flex flex-1 items-center justify-center px-10 py-16 sm:px-16 lg:px-24">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 lg:pl-4">
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#DCDCDA]">
          <Image
            src="/auth-panel.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  )
}
