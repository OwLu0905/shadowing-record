import React from "react";
import Link from "next/link";

import ToggleTheme from "@/components/layout/theme/toggle-theme";
import AuthHeader from "@/components/layout/header/auth-header";
import GuestHeader from "@/components/layout/header/guest-header";

import { MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { auth } from "@/lib/auth";

import MobileNavContainer from "../sidebar/mobile-container";

const Header = async () => {
  const session = await auth();
  return (
    <header className="flex h-14 w-full items-center gap-4 pr-2 shadow-sm shadow-accent md:pl-10 md:pr-10">
      <Drawer direction="left">
        <DrawerTrigger className="block p-4 md:hidden" disabled={!session}>
          <MenuIcon className="h-4 w-4 md:h-5 md:w-5" />
        </DrawerTrigger>
        <DrawerContent className="fixed bottom-0 right-0 mt-24 flex h-full w-full max-w-md flex-col rounded-t-[0px] bg-card">
          <MobileNavContainer />
        </DrawerContent>
      </Drawer>
      <Link href="/">
        <h1 className="bg-gradient-to-br from-primary/90 to-primary/20 bg-clip-text text-lg font-bold text-transparent lg:text-xl">
          ShadowGarden
        </h1>
      </Link>
      <div className="w-full flex-1"></div>
      <ToggleTheme />
      {session ? <AuthHeader /> : <GuestHeader />}
    </header>
  );
};

export default Header;
