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
  KeyRound,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { changePassword } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

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
    { label: "Projects", value: projects, icon: FolderKanban, href: "/admin/content/projects" },
    { label: "News Articles", value: news, icon: Newspaper, href: "/admin/content/news" },
    { label: "Events", value: events, icon: CalendarDays, href: "/admin/content/events" },
    { label: "Publications", value: publications, icon: FileText, href: "/admin/content/publications" },
    { label: "Products", value: products, icon: ShoppingBag, href: "/admin/content/products" },
    { label: "Successful Donations", value: donations, icon: Heart, href: "/admin/content/donations" },
    { label: "New Suggestions", value: suggestions, icon: Lightbulb, href: "/admin/content/suggestions" },
    { label: "New Messages", value: messages, icon: Mail, href: "/admin/content/messages" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Total donations received:{" "}
          <strong className="text-primary">
            {formatMoney(totalDonated._sum.amount?.toString() ?? "0")}
          </strong>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={changePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password (min. 8 characters)</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            <Button type="submit" size="sm">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
