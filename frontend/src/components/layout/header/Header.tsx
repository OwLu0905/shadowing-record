import React from "react";
import Link from "next/link";

import ToggleTheme from "@/components/layout/theme/toggle-theme";
import AuthHeader from "@/components/layout/header/auth-header";
import GuestHeader from "@/components/layout/header/guest-header";
import { auth } from "@/lib/auth";

import { MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const Header = async () => {
  // const user = await auth();
  return (
    <header className="bg-background w-full pr-10 lg:pr-20 flex h-14 py-8 items-center gap-4 shadow-accent shadow-sm">
      <Drawer direction="left">
        {/** <DrawerTrigger className="visible md:invisible transition-all durtion-300 ease-in-out md:opacity-0 opacity-100">*/}
        <DrawerTrigger className="px-6">
          <MenuIcon className="h-5 w-5" />
        </DrawerTrigger>
        <DrawerContent className="bg-background flex flex-col rounded-t-[0px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
          213
        </DrawerContent>
      </Drawer>
      <Link href="/">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground/90 from-40% via-muted/60 to-muted">
          Terrific
        </h1>
      </Link>
      <div className="w-full flex-1"></div>
      <ToggleTheme />
      {false ? <AuthHeader /> : <GuestHeader />}
    </header>
  );
};

export default Header;
