import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/icons"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            AttendEase
          </span>
        </Link>
        <MainNav />
      </div>
    </header>
  )
}
