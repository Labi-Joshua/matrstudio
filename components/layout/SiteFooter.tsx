import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#F9F9F9]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-0 lg:px-8">
        <Image src="/matrstudio..png" alt="Matrstudio" width={95} height={15} />
        <p className="text-xs text-muted-foreground">
          resources.matrstudio.com &middot; curated for the community
        </p>
      </div>
    </footer>
  )
}
