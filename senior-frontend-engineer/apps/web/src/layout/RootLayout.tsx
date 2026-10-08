import { useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { isSimulatingFailure, linkClass, setSimulateFailure } from '@app/shared';

// Demo control: makes every write fail so the optimistic rollback can be seen.
function FailureToggle() {
  const [enabled, setEnabled] = useState(isSimulatingFailure);

  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => {
          setSimulateFailure(event.target.checked);
          setEnabled(event.target.checked);
        }}
      />
      Simulate server failure
    </label>
  );
}

export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <p className="font-semibold">JTL Todos</p>
          <nav aria-label="Main">
            <ul className="flex gap-4">
              <li>
                <Link
                  to="/users/new"
                  className={linkClass}
                  activeProps={{ className: 'font-semibold' }}
                >
                  New user
                </Link>
              </li>
              <li>
                <Link to="/todos" className={linkClass} activeProps={{ className: 'font-semibold' }}>
                  Todos
                </Link>
              </li>
            </ul>
          </nav>
          <FailureToggle />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
