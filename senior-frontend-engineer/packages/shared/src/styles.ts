const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

export const inputClass = `block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-slate-900 shadow-sm aria-invalid:border-red-600 ${focusRing}`;

export const buttonClass = `inline-flex items-center rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const linkClass = `rounded-sm text-indigo-700 underline underline-offset-2 hover:text-indigo-900 ${focusRing}`;

export const alertClass =
  'rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800';
