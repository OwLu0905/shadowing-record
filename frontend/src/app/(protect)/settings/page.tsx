import { auth } from "@/lib/auth";
import React from "react";

const SettingPage = async () => {
  const a = await auth();
  console.log(a);
  return <div>SettingPage</div>;
};

export default SettingPage;
