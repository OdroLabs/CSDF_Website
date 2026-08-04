"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Globe,
  PanelTop,
  PanelBottom,
  Home,
  Info,
  Phone,
  Languages,
  Files,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsLinks = [
  { href: "/admin/settings/general", label: "General", icon: Globe },
  { href: "/admin/settings/header", label: "Header & Menu", icon: PanelTop },
  { href: "/admin/settings/footer", label: "Footer", icon: PanelBottom },
  { href: "/admin/settings/home", label: "Home Page", icon: Home },
  { href: "/admin/settings/about", label: "About Page", icon: Info },
  { href: "/admin/settings/contact", label: "Contact Page", icon: Phone },
  { href: "/admin/settings/donate", label: "Donation Page", icon: Heart },
  { href: "/admin/settings/pages", label: "Other Pages", icon: Files },
  { href: "/admin/settings/labels", label: "Labels & Translations", icon: Languages },
];

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

export function AdminSidebar({ role, email }: { role: string; email?: string }) {
  const pathname = usePathname();
  // Site settings and user management are owner-only.
  const isOwner = role === "owner";

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200",
          active
            ? "bg-white/10 text-white shadow-inner ring-1 ring-white/10"
            : "text-white/55 hover:bg-white/[0.06] hover:text-white"
        )}
      >
        {active && (
          <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent" />
        )}
        <Icon className={cn("h-[15px] w-[15px] shrink-0", active ? "text-accent" : "text-white/40 group-hover:text-white/70")} />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  const GroupLabel = ({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) => (
    <p className="mb-1.5 flex items-center gap-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
      {Icon && <Icon className="h-3 w-3" />} {children}
    </p>
  );

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-secondary text-white">
      <div className="flex shrink-0 items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg ring-1 ring-white/10">
          <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="h-full w-full object-cover" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight">CSDF Admin</p>
          <p className="truncate text-[11px] text-white/40">Content &amp; Settings</p>
        </div>
      </div>

      <nav className="scroll-dark flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          <NavLink href="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
          {isOwner && <NavLink href="/admin/users" label="Users" icon={UsersRound} />}
        </div>
        {isOwner && (
          <div>
            <GroupLabel icon={Settings}>Site Settings</GroupLabel>
            <div className="space-y-0.5">
              {settingsLinks.map((l) => (
                <NavLink key={l.href} {...l} />
              ))}
            </div>
          </div>
        )}
        <div>
          <GroupLabel>Content</GroupLabel>
          <div className="space-y-0.5">
            {contentLinks.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>
        <div>
          <GroupLabel>Inbox</GroupLabel>
          <div className="space-y-0.5">
            {inboxLinks.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>
      </nav>

      {email && (
        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent">
              {email.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white/90">{email}</p>
              <p className="truncate text-[10px] uppercase tracking-wide text-white/35">{role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
