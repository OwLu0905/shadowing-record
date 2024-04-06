import { useSyncExternalStore } from "react";

export const useToggleSidebar = (
  name: string,
): [boolean, (data: boolean) => void] => {
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
}

function getServerSnapshot() {
  return "true"; // Always show "Online" for server-generated HTML
}
