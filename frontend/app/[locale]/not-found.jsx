import { Link } from "@/i18n/navigation";

import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <FaExclamationTriangle className="text-6xl text-destructive" aria-hidden />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-destructive">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
