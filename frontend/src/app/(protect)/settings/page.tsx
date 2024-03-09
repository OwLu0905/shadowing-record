import { auth } from "@/lib/auth";
import React from "react";

const SettingPage = async () => {
  const a = await auth();

  return <div>{JSON.stringify(a)}</div>;
};

export default SettingPage;
