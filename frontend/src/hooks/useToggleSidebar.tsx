"use client";
import { useSyncExternalStore } from "react";
import { z, ZodTransformer } from "zod";

const useToggleSidebar = (name: string): [boolean, (data: boolean) => void] => {
  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot.bind(null, name),
    getServerSnapshot,
  );

  const isOpenBoolean = isOpen === "true" ? true : false;

  const setValue = (value: boolean) => {
    window.localStorage.setItem(name, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent("toggle-sidebar"));
  };
  return [isOpenBoolean, setValue];
};

function subscribe(callback: () => void) {
  window.addEventListener("toggle-sidebar", callback);
  return () => {
    window.removeEventListener("toggle-sidebar", callback);
  };
}

function getSnapshot(name: string) {
  const isOpenString = window.localStorage.getItem(name);

  const validationToggleData = isOpenString === "false" ? "false" : "true";

  return validationToggleData;

  // const stringSchema = z.string();
  // const validString = stringSchema.safeParse(isOpenString);
  // if (!validString.success) return JSON.stringify(true) as string;
  //
  // const booleanSchema = z.boolean();
  // const validIsOpen = booleanSchema.safeParse(JSON.parse(validString.data));
  // if (!validIsOpen.success) return JSON.stringify(true) as string;
}

function getServerSnapshot() {
  return "true"; // Always show "Online" for server-generated HTML
}

export default useToggleSidebar;
