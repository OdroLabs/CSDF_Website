import Link from "next/link";
import {
  FolderKanban,
  Newspaper,
  CalendarDays,
  Heart,
  Lightbulb,
  Mail,
  ShoppingBag,
  FileText,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [projects, news, events, publications, products, donations, suggestions, messages, totalDonated] =
    await Promise.all([
      prisma.project.count(),
      prisma.news.count(),
      prisma.event.count(),
      prisma.publication.count(),
      prisma.product.count(),
      prisma.donation.count({ where: { status: "success" } }),
      prisma.suggestion.count({ where: { read: false } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.donation.aggregate({ where: { status: "success" }, _sum: { amount: true } }),
    ]);

  const cards = [
    { label: "Projects", value: projects, icon: FolderKanban, href: "/admin/content/projects", tint: "bg-brand-50 text-primary" },
    { label: "News Articles", value: news, icon: Newspaper, href: "/admin/content/news", tint: "bg-brand-50 text-primary" },
    { label: "Events", value: events, icon: CalendarDays, href: "/admin/content/events", tint: "bg-teal-50 text-teal-700" },
    { label: "Publications", value: publications, icon: FileText, href: "/admin/content/publications", tint: "bg-teal-50 text-teal-700" },
    { label: "Products", value: products, icon: ShoppingBag, href: "/admin/content/products", tint: "bg-amber-50 text-amber-700" },
    { label: "Successful Donations", value: donations, icon: Heart, href: "/admin/content/donations", tint: "bg-rose-50 text-rose-600" },
    { label: "New Suggestions", value: suggestions, icon: Lightbulb, href: "/admin/content/suggestions", tint: "bg-amber-50 text-amber-700", alert: suggestions > 0 },
    { label: "New Messages", value: messages, icon: Mail, href: "/admin/content/messages", tint: "bg-rose-50 text-rose-600", alert: messages > 0 },
  ];

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">An overview of everything happening on your site.</p>
        </div>
        <Card className="w-full max-w-xs shrink-0 overflow-hidden border-none bg-secondary text-white shadow-pop">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] uppercase tracking-wide text-white/50">Total Donated</p>
              <p className="truncate font-number text-2xl font-bold leading-tight">
                {formatMoney(totalDonated._sum.amount?.toString() ?? "0")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", card.tint)}>
                  <card.icon className="h-5 w-5" />
                  {card.alert && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-number text-2xl font-bold leading-none text-foreground">{card.value}</p>
                  <p className="mt-1.5 truncate text-xs text-muted-foreground">{card.label}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
