"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Feed", href: "/" },
  { label: "Curation", href: "/curation" },
  { label: "Clients", href: "/clients/muller" },
  { label: "Email", href: "/email" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-semibold text-text">
            Klar
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const active =
                tab.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-1.5 text-base font-medium rounded-[4px] transition-colors ${
                    active
                      ? "text-copper"
                      : "text-muted hover:text-text"
                  }`}
                >
                  <span
                    className={
                      active
                        ? "border-b-2 border-copper pb-1"
                        : ""
                    }
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-xs font-medium text-muted">
          MA
        </div>
      </div>
    </nav>
  );
}
