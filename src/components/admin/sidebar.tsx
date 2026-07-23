"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  HandHeart,
  FileText,
  Newspaper,
  CalendarDays,
  Images,
  ShoppingBag,
  Quote,
  Handshake,
  BarChart3,
  Heart,
  Lightbulb,
  Mail,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentLinks = [
  { href: "/admin/content/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content/services", label: "Services", icon: HandHeart },
  { href: "/admin/content/publications", label: "Publications", icon: FileText },
  { href: "/admin/content/news", label: "News", icon: Newspaper },
  { href: "/admin/content/events", label: "Events", icon: CalendarDays },
  { href: "/admin/content/gallery", label: "Gallery", icon: Images },
  { href: "/admin/content/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/content/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/content/partners", label: "Partners", icon: Handshake },
  { href: "/admin/content/stats", label: "Impact Stats", icon: BarChart3 },
];

const inboxLinks = [
  { href: "/admin/content/donations", label: "Donations", icon: Heart },
  { href: "/admin/content/suggestions", label: "Suggestions", icon: Lightbulb },
  { href: "/admin/content/messages", label: "Messages", icon: Mail },
  { href: "/admin/content/subscribers", label: "Subscribers", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
        pathname.startsWith(href)
          ? "bg-primary text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-brand-950 text-white">
      <div className="flex items-center gap-2 border-b border-white/10 p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold">
          C
        </span>
        <span className="font-bold">CSDF Admin</span>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <div className="space-y-0.5">
          <NavLink href="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavLink href="/admin/settings" label="Site Settings" icon={Settings} />
        </div>
        <div>
          <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-white/40">
            Content
          </p>
          <div className="space-y-0.5">
            {contentLinks.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-white/40">
            Inbox
          </p>
          <div className="space-y-0.5">
            {inboxLinks.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>
      </nav>
      <div className="space-y-0.5 border-t border-white/10 p-3">
        <a
          href="/en"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View Site
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
