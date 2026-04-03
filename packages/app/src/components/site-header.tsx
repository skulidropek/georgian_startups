import Link from "next/link"

const navigation = [
  { href: "/", label: "Home" },
  { href: "/startups", label: "Startups" },
  { href: "/submit", label: "Add startup" }
] as const

export const SiteHeader = () => (
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
      <Link className="site-nav__link" href="/login">
        Login
      </Link>
      <Link className="site-nav__link" href="/register">
        Register
      </Link>
    </nav>
  </header>
)
