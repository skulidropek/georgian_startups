import type { Metadata } from "next"
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google"
import Link from "next/link"
import type { ReactNode } from "react"

import { SiteHeader } from "@/components/site-header"
import { siteDescription, siteTitle } from "@/lib/site"

import "./globals.css"

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body"
})

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
})

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`
  },
  description: siteDescription
}

const footerLinks = [
  { href: "/submit", label: "Add startup" },
  { href: "/startups", label: "Browse startups" }
] as const

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <div className="page-shell">
          <SiteHeader />
          <main className="page-main">{children}</main>
          <footer className="site-footer">
            <p>
              Simple catalog for browsing startups and adding new ones through a
              protected flow.
            </p>
            <div className="site-footer__links">
              {footerLinks.map((item) => (
                <Link key={item.href} className="site-footer__link" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
