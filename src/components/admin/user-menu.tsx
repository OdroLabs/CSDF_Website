"use client";

import { signOut } from "next-auth/react";
import { ChevronDown, ExternalLink, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminUserMenu({ email, role }: { email: string; role: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 text-left transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
          {email.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium text-foreground sm:inline">
          {email}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="truncate normal-case tracking-normal text-foreground">
          {email}
          <span className="ml-1.5 text-xs font-normal capitalize text-muted-foreground">({role})</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/en" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:bg-red-50 focus:text-red-700"
          onSelect={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
