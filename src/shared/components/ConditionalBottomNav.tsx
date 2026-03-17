"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./BottomNavigation";

export default function ConditionalBottomNav() {
  const pathname = usePathname();

  const hideOnRoutes = ["/login", "/register"];

  if (hideOnRoutes.includes(pathname)) {
    return null;
  }

  return <BottomNavigation />;
}
