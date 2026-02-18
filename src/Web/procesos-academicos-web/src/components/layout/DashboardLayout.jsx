import { useState } from "react";
import RoleSidebar from "../navigation/RoleSidebar";
import TopHeader from "../navigation/TopHeader";

export default function DashboardLayout({
  roleLabel,
  profile,
  navItems,
  title,
  subtitle,
  actions,
  searchPlaceholder,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <RoleSidebar
          isOpen={sidebarOpen}
          navItems={navItems}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
          roleLabel={roleLabel}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader
            actions={actions}
            onMenuOpen={() => setSidebarOpen(true)}
            searchPlaceholder={searchPlaceholder}
            subtitle={subtitle}
            title={title}
          />
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
