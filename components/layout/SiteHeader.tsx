import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { SearchInput } from './SearchInput'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-[16px] sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/matrstudio..png" alt="Matrstudio" width={95} height={15} priority />
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex w-[366px] items-center gap-2 rounded-full bg-[#F0F0F0] py-2.5 pl-4 pr-4">
            <svg
              className="shrink-0 size-4 text-muted-foreground"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <circle cx="8.5" cy="8.5" r="5.75" />
              <path strokeLinecap="round" d="M13 13l3.5 3.5" />
            </svg>
            <Suspense fallback={<div className="flex-1" />}>
              <SearchInput />
            </Suspense>
          </div>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-[6px] rounded-full bg-primary px-[16px] py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Submit a Resource
          </Link>
        </div>
      </div>
    </header>
  )
}

