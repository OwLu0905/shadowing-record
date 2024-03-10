"use client";
import { Button } from "@/components/ui/button";
import { MenuIcon, Plus } from "lucide-react";
import { useState } from "react";

const SideNav = () => {
  // NOTE: use useSyncExternalStore to store in localstorage
  const [open, setOpen] = useState(true);
  return (
    <div
      className="hidden flex-[0_0_auto] flex-col bg-secondary/80 transition-all duration-300 ease-in-out data-[expand=false]:w-[60px] data-[expand=true]:w-72 md:flex"
      data-expand={open}
    >
      <Button
        variant={"ghost"}
        onClick={() => setOpen((prev) => !prev)}
        size="sm"
        className="mx-3 my-4 w-fit px-2"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      <Button
        variant={"default"}
        onClick={() => setOpen((prev) => !prev)}
        size="sm"
        className="mx-3 mb-4 w-fit px-2"
      >
        <Plus className="h-5 w-5" />
      </Button>
      <ul
        className="mx-6 flex flex-col items-start gap-y-2 transition-opacity duration-300 ease-in data-[expand=true]:visible data-[expand=false]:invisible data-[expand=false]:opacity-0 data-[expand=true]:opacity-100"
        data-expand={open}
      >
        <li className="w-full truncate">
          <Button variant={"link"}>
            <p className="">
              sit amet consectetur adipisicing elit. Voluptate nobis esse fuga
              dolore doloribus ducimus minus laudantium impedit quam omnis a
              eius dicta, nesciunt repudiandae necessitatibus quos autem illum
              nam?
            </p>
          </Button>
        </li>

        <li>
          <Button variant={"link"} className="w-full">
            Lorem ipsum dolor sit.
          </Button>
        </li>

        <li>
          <Button variant={"link"} className="w-full">
            Lorem ipsum dolor sit amet.
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
