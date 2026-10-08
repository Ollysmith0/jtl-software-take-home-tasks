import { Link } from '@tanstack/react-router';
import { linkClass } from '@app/shared';

export function NotFoundPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p>
        <Link to="/users/new" className={linkClass}>
          Go to the start page
        </Link>
      </p>
    </>
  );
}
