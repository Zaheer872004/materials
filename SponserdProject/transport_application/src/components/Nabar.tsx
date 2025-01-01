"use client";
import React, { useState, useCallback } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  // Memoized version of setActive to prevent unnecessary re-renders
  const handleSetActive = useCallback((item: string | null) => {
    setActive(item);
  }, []);

  return (
    <div
      className={cn("fixed top-10 flex items-end justify-center inset-x-0  max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={handleSetActive}>
        <Link href="/">
          <MenuItem setActive={handleSetActive} active={active} item="Home">
            {/* Additional links can be added here */}
          </MenuItem>
        </Link>

        <Link href="/about">
          <MenuItem setActive={handleSetActive} active={active} item="About">
            {/* Additional content for About */}
          </MenuItem>
        </Link>

        <Link href="/product">
          <MenuItem setActive={handleSetActive} active={active} item="Product">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/Compression Fittings">Compression Fittings</HoveredLink>
              <HoveredLink href="/Pipe Fittings">Pipe Fittings</HoveredLink>
              <HoveredLink href="/Valves">Valves</HoveredLink>
              <HoveredLink href="/Forgings">Forgings</HoveredLink>
            </div>
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}
