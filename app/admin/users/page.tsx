"use client";

import Header from "@/components/header/Header";
import AdminPanel from "@/components/adminPanel/adminPanel";
import AdminMenu from "@/components/AdminMenu/AdminMenu";

export default function AdminPanelPage() {
  return (
    <div>
      <Header />
      <AdminMenu />
      <AdminPanel />
    </div>
  );
}

