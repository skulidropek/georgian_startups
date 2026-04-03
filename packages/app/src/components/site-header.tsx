"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { logoutAction } from "@/app/actions/logout"

const navigation = [
  { href: "/", label: "Home" },
  { href: "/startups", label: "Startups" },
  { href: "/submit", label: "Add startup" }
] as const

export const SiteHeader = () => {
  const pathname = usePathname()
  const showLogout = pathname === "/submit"

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/">
        <span>Georgian Startups</span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {navigation.map((item) => (
          <Link key={item.href} className="site-nav__link" href={item.href}>
            {item.label}
          </Link>
        ))}
        {showLogout ? (
          <form action={logoutAction}>
            <button className="site-nav__button" type="submit">
              Logout
            </button>
          </form>
        ) : null}
      </nav>
    </header>
  )
}
