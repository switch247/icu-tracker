import React from "react";

import { Button } from "@/components/ui/button";
interface SidebarProps {
  children: React.ReactNode;
  onClearFilters: () => void;
}

export function Sidebar({ children, onClearFilters }: SidebarProps) {
  return (
    <aside className="w-64 p-4 border-r bg-gray-100 h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant={"link"}
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear Filters
        </Button>
      </div>
      {children}
    </aside>
  );
}
