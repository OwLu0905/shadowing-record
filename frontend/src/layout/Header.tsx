import React from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import ToggleTheme from "./toggle-theme";
import AuthHeader from "./AuthHeader";
import GuestHeader from "./GuestHeader";

const Header = () => {
  return (
    <header className="bg-background w-full px-20 flex h-14 py-8 items-center gap-4 shadow-accent shadow-sm">
      <Link href="/">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground/90 from-40% via-muted/60 to-muted">
          Terrific
        </h1>
      </Link>
      <div className="w-full flex-1"></div>
      <ToggleTheme />
      <AuthHeader />
      <GuestHeader />
    </header>
  );
};

export default Header;
