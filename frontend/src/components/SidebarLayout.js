import React, { useState } from 'react';
import Sidebar from './Sidebar';

function SidebarLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      {/* Mobile toggle */}
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          Open menu
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
          <Sidebar />
        </aside>

        <div className="space-y-8">{children}</div>
      </div>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-80 rounded-r-[2rem] border-r border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default SidebarLayout;
